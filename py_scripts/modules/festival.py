"""
축제 데이터 수집 및 관심도 점수 계산 모듈
서울시 API에서 축제 데이터를 수집하고 네이버 검색량 기반 buzz_score를 계산합니다.
"""

import requests
import json
import math
import time
import re
from datetime import datetime, timedelta
import sys
import os

# 상위 디렉토리의 config 모듈 import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import (
    SEOUL_API_KEY,
    NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET,
    SEOUL_FESTIVAL_URL,
    NAVER_BLOG_SEARCH_URL,
    NAVER_LOCAL_SEARCH_URL,
    SAVE_PATH
)


def get_season(month):
    """월을 기준으로 계절 판별"""
    if month in [3, 4, 5]:
        return "봄"
    elif month in [6, 7, 8]:
        return "여름"
    elif month in [9, 10, 11]:
        return "가을"
    else:
        return "겨울"


# 주요 장소 좌표 사전 (네이버 좌표 형식: WGS84 × 10^7)
KNOWN_VENUES = {
    "코엑스": ("1270589070", "375126340"),
    "올림픽공원": ("1270776060", "375246360"),
    "예술의전당": ("1270028900", "374820860"),
    "세종문화회관": ("1269758500", "375727850"),
    "국립중앙박물관": ("1269820160", "375213590"),
    "동대문디자인플라자": ("1270091880", "375660570"),
    "DDP": ("1270091880", "375660570"),
    "광화문광장": ("1269756380", "375745580"),
    "서울시청": ("1269784147", "375666805"),
    "청계광장": ("1269833050", "375694750"),
    "잠실종합운동장": ("1270734760", "375141330"),
    "잠실실내체육관": ("1270734760", "375141330"),
    "롯데월드": ("1270734000", "375117000"),
    "서울숲": ("1270449360", "375445610"),
    "남산공원": ("1269899430", "375543070"),
    "한강공원": ("1269800000", "375200000"),
    "여의도공원": ("1269358360", "375252980"),
    "노들섬": ("1269552000", "375105000"),
    "반포한강공원": ("1269864550", "375034650"),
    "뚝섬": ("1270570000", "375400000"),
}


def normalize_place_name(place_name: str) -> str:
    """
    장소명 정규화 - 검색 성공률 향상

    Args:
        place_name: 원본 장소명 (예: "코엑스 A홀, C홀 ")

    Returns:
        정규화된 장소명 (예: "코엑스")
    """
    if not place_name:
        return ""

    # 1. 앞뒤 공백 제거
    name = place_name.strip()

    # 2. 쉼표가 있으면 첫 번째 장소만 사용
    if "," in name:
        name = name.split(",")[0].strip()

    # 3. 괄호 안 내용 제거 (예: "세종문화회관 (대극장)" → "세종문화회관")
    name = re.sub(r'\s*\([^)]*\)\s*', ' ', name).strip()

    # 4. 홀/관/장/실 정보 제거 (예: "코엑스 A홀" → "코엑스")
    name = re.sub(r'\s+[A-Za-z0-9가-힣]*홀\s*$', '', name).strip()
    name = re.sub(r'\s+[A-Za-z0-9가-힣]*관\s*$', '', name).strip()
    name = re.sub(r'\s+[A-Za-z0-9가-힣]*장\s*$', '', name).strip()
    name = re.sub(r'\s+[A-Za-z0-9가-힣]*실\s*$', '', name).strip()

    return name


def get_venue_cache_key(place_name: str, gu_name: str) -> str:
    """장소 캐시 키 생성 (구명_장소명)"""
    return f"{gu_name.strip()}_{place_name.strip()}"


def fill_missing_coordinates(festivals: list) -> tuple:
    """
    같은 PLACE의 좌표를 활용해 누락된 좌표 채우기

    Args:
        festivals: 처리된 축제 리스트

    Returns:
        tuple: (수정된 축제 리스트, 보완된 개수)
    """
    venue_coords = {}

    # 1단계: 장소별 좌표 수집
    for fest in festivals:
        place = fest.get("PLACE", "").strip()
        if place and fest.get("mapx") and fest.get("mapy"):
            venue_coords[place] = (fest["mapx"], fest["mapy"])

    # 2단계: 누락된 좌표 채우기
    filled = 0
    for fest in festivals:
        place = fest.get("PLACE", "").strip()
        if place and (not fest.get("mapx") or not fest.get("mapy")):
            if place in venue_coords:
                fest["mapx"], fest["mapy"] = venue_coords[place]
                filled += 1
                print(f"  → 좌표 보완: {fest['TITLE'][:25]}... ({place[:15]})")

    return festivals, filled


def print_coordinate_stats(festivals: list, cache_hits: int, api_calls: int, filled: int):
    """좌표 조회 결과 통계 출력"""
    total = len(festivals)
    with_coords = sum(1 for f in festivals if f.get("mapx") and f.get("mapy"))
    without_coords = total - with_coords

    print("\n" + "=" * 50)
    print("📊 좌표 조회 결과")
    print("=" * 50)
    print(f"  총 축제: {total}개")
    print(f"  좌표 있음: {with_coords}개")
    print(f"  좌표 없음: {without_coords}개")
    print("-" * 50)
    print(f"  API 호출: {api_calls}회")
    print(f"  캐시 적중: {cache_hits}회")
    print(f"  좌표 보완: {filled}개")
    print("=" * 50)


def search_location_api(query: str) -> tuple:
    """
    네이버 Local Search API로 좌표 검색 (내부 헬퍼)

    Args:
        query: 검색 쿼리

    Returns:
        tuple: (mapx, mapy) 또는 ("", "")
    """
    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }
    params = {
        "query": query,
        "display": 1
    }

    try:
        response = requests.get(NAVER_LOCAL_SEARCH_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

        if data.get("items"):
            item = data["items"][0]
            return item.get("mapx", ""), item.get("mapy", "")

    except Exception as e:
        print(f"  [WARN] API 호출 실패 ({query}): {e}")

    return "", ""


def get_festival_coordinates(place_name: str, gu_name: str) -> tuple:
    """
    네이버 Local Search API로 축제 장소 좌표 수집
    KNOWN_VENUES 사전과 정규화를 활용한 폴백 검색 지원

    Args:
        place_name (str): 축제 장소명 (예: "코엑스 A홀")
        gu_name (str): 자치구명 (예: "강남구")

    Returns:
        tuple: (mapx, mapy) - 네이버 좌표 형식
    """
    if not NAVER_CLIENT_ID or NAVER_CLIENT_ID == "여기에_네이버_클라이언트_ID_입력":
        return "", ""

    # 1차: KNOWN_VENUES에서 먼저 확인
    normalized = normalize_place_name(place_name)
    for venue_name, coords in KNOWN_VENUES.items():
        if venue_name in place_name or venue_name in normalized:
            print(f"           → KNOWN_VENUES 적중: {venue_name}")
            return coords

    # 2차: 원본 장소명으로 API 검색
    query = f"서울 {gu_name} {place_name.strip()}"
    mapx, mapy = search_location_api(query)
    if mapx and mapy:
        return mapx, mapy

    # 3차: 정규화된 장소명으로 재시도
    if normalized and normalized != place_name.strip():
        query = f"서울 {gu_name} {normalized}"
        print(f"           → 정규화 재시도: {normalized}")
        mapx, mapy = search_location_api(query)
        if mapx and mapy:
            return mapx, mapy

    # 4차: 장소명만으로 검색 (구 정보 제외)
    if normalized:
        query = f"서울 {normalized}"
        mapx, mapy = search_location_api(query)
        if mapx and mapy:
            return mapx, mapy

    return "", ""


def get_buzz_score(festival_title):
    """
    네이버 블로그 검색량 기반 관심도 점수 계산

    Args:
        festival_title (str): 축제 제목

    Returns:
        int: 관심도 점수 (0-100)
    """
    # API 키 확인
    if NAVER_CLIENT_ID == "여기에_네이버_클라이언트_ID_입력":
        # API 키가 없으면 기본값 반환
        return 50

    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }

    params = {
        "query": festival_title,
        "display": 1  # 검색 결과 개수 (total만 필요하므로 1개)
    }

    try:
        response = requests.get(NAVER_BLOG_SEARCH_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        total = data.get("total", 0)

        # 관심도 점수 계산 (로그 스케일)
        if total == 0:
            return 30  # 검색 결과 없음
        elif total < 100:
            return min(50 + total // 2, 70)
        else:
            # 로그 스케일 적용 (검색량이 많을수록 점수가 완만하게 증가)
            return min(70 + int(math.log10(total) * 10), 100)

    except Exception as e:
        print(f"  [WARN] 검색량 조회 실패 ({festival_title}): {e}")
        return 50  # 기본값


def fetch_festivals():
    """서울시 축제 API 호출하여 데이터 수집"""

    # API 키 확인
    if not SEOUL_API_KEY:
        print("[WARN] 서울시 API 키가 설정되지 않았습니다.")
        print(".env 파일에서 SEOUL_API_KEY를 설정해주세요.")
        return []

    # 현재 날짜 기준 필터링 범위
    today = datetime.now()
    filter_start = today - timedelta(days=30)   # 1개월 전부터
    filter_end = today + timedelta(days=365)    # 1년 후까지

    # 전체 데이터 수집 (1~1000건)
    url = SEOUL_FESTIVAL_URL.format(
        key=SEOUL_API_KEY,
        start=1,
        end=1000
    )

    all_festivals = []

    try:
        print(f"  [DATE] 필터 기간: {filter_start.strftime('%Y-%m-%d')} ~ {filter_end.strftime('%Y-%m-%d')}")
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # 최상위 RESULT 키 처리 (데이터 없음 또는 에러)
        if "RESULT" in data and "culturalEventInfo" not in data:
            code = data["RESULT"]["CODE"]
            msg = data["RESULT"].get("MESSAGE", "")
            if code == "INFO-200":
                print(f"  [WARN] 데이터 없음: {msg}")
            else:
                print(f"  [WARN] API 오류 ({code}): {msg}")
            return []

        # API 응답 구조 확인
        if "culturalEventInfo" in data:
            result = data["culturalEventInfo"]
            total_count = result.get("list_total_count", 0)
            print(f"  [INFO] 전체 데이터: {total_count}건")

            # 데이터 추출
            rows = result.get("row", [])

            # 날짜 필터링 (Python에서 처리)
            for row in rows:
                try:
                    # STRTDATE 형식: "2026-01-20 00:00:00.0"
                    start_str = row.get("STRTDATE", "")
                    if start_str:
                        start_dt = datetime.strptime(start_str[:10], "%Y-%m-%d")
                        if filter_start <= start_dt <= filter_end:
                            all_festivals.append(row)
                except:
                    # 날짜 파싱 실패 시 포함
                    all_festivals.append(row)

            print(f"  [OK] 필터 후 {len(all_festivals)}개 축제 수집 완료")
        else:
            print(f"  [WARN] 예상치 못한 응답 구조: {data.keys()}")

    except requests.exceptions.RequestException as e:
        print(f"  [ERROR] 축제 데이터 수집 실패: {e}")
    except Exception as e:
        print(f"  [ERROR] 데이터 처리 오류: {e}")

    return all_festivals


def process_festivals(raw_festivals):
    """
    축제 데이터 처리 및 관심도 점수 추가

    Args:
        raw_festivals (list): 서울시 API에서 가져온 원본 데이터

    Returns:
        list: 처리된 축제 데이터 (buzz_score 포함)
    """
    processed = []
    total = len(raw_festivals)

    # 좌표 캐시 및 통계
    venue_cache = {}
    cache_hits = 0
    api_calls = 0

    for idx, item in enumerate(raw_festivals, 1):
        try:
            # 시작 날짜에서 월 추출
            start_date = item.get("STRTDATE", "")
            if len(start_date) >= 6:
                start_month = int(start_date[4:6])
            else:
                start_month = datetime.now().month

            season = get_season(start_month)

            # 관심도 점수 계산
            title = item.get("TITLE", "")
            place_name = item.get("PLACE", "")
            gu_name = item.get("GUNAME", "")

            print(f"  [{idx}/{total}] {title}")
            print(f"           검색량 조회 중...")
            buzz_score = get_buzz_score(title)
            time.sleep(0.1)  # API 호출 제한 준수

            # 좌표 수집 (캐시 사용)
            cache_key = get_venue_cache_key(place_name, gu_name)
            print(f"           좌표 조회 중... ({place_name})")

            if cache_key in venue_cache:
                # 캐시에서 가져오기
                mapx, mapy = venue_cache[cache_key]
                cache_hits += 1
                print(f"           → 캐시: ({mapx}, {mapy})")
            else:
                # API 호출
                mapx, mapy = get_festival_coordinates(place_name, gu_name)
                api_calls += 1
                if mapx and mapy:
                    venue_cache[cache_key] = (mapx, mapy)
                    print(f"           → 좌표: ({mapx}, {mapy})")
                else:
                    print(f"           → 좌표 없음")

            # 데이터 정제
            processed.append({
                "season": season,
                "GUNAME": gu_name,
                "TITLE": title,
                "DATE": item.get("DATE", ""),
                "PLACE": place_name,
                "ORG_NAME": item.get("ORG_NAME", ""),
                "USE_TRGT": item.get("USE_TRGT", ""),
                "MAIN_IMG": item.get("MAIN_IMG", ""),
                "IS_FREE": item.get("IS_FREE", ""),
                "HMPG_ADDR": item.get("HMPG_ADDR", ""),
                "PROGRAM": item.get("PROGRAM", ""),
                "STRTDATE": item.get("STRTDATE", ""),
                "END_DATE": item.get("END_DATE", ""),
                "buzz_score": buzz_score,
                "mapx": mapx,
                "mapy": mapy
            })

            # API 호출 제한 준수 (QPS 10 = 0.1초 간격)
            if NAVER_CLIENT_ID != "여기에_네이버_클라이언트_ID_입력":
                time.sleep(0.1)

        except Exception as e:
            print(f"  [WARN] 데이터 처리 오류 (항목 {idx}): {e}")
            continue

    # 후처리: 좌표 검증 및 보완
    print("\n🔍 좌표 검증 및 보완 중...")
    processed, filled = fill_missing_coordinates(processed)

    # 통계 출력
    print_coordinate_stats(processed, cache_hits, api_calls, filled)

    return processed


def fetch_and_save():
    """전체 프로세스 실행: 수집 → 처리 → 저장"""
    print("\n" + "="*60)
    print("[FESTIVAL] 축제 데이터 수집 시작")
    print("="*60)

    # 1. 데이터 수집
    raw = fetch_festivals()
    if not raw:
        print("  [WARN] 수집된 데이터가 없습니다.")
        print("  generate_sample_data.py를 실행하여 샘플 데이터를 생성하세요.")
        return

    print(f"\n[OK] 총 {len(raw)}개 축제 수집 완료\n")

    # 2. 관심도 점수 계산
    print("[INFO] 관심도 점수 계산 중...")
    processed = process_festivals(raw)

    # 3. 저장
    SAVE_PATH.mkdir(parents=True, exist_ok=True)
    output_file = SAVE_PATH / "festival_data.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)

    print(f"\n[SAVED] {output_file}")
    print(f"[INFO] 총 {len(processed)}개 축제 데이터 저장")
    print("="*60 + "\n")


if __name__ == "__main__":
    fetch_and_save()
