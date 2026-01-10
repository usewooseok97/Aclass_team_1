"""
축제 데이터 수집 및 관심도 점수 계산 모듈
서울시 API에서 축제 데이터를 수집하고 네이버 검색량 기반 buzz_score를 계산합니다.
"""

import requests
import json
import math
import time
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
        print(f"  ⚠️ 검색량 조회 실패 ({festival_title}): {e}")
        return 50  # 기본값


def fetch_festivals():
    """서울시 축제 API 호출하여 데이터 수집"""

    # API 키 확인
    if SEOUL_API_KEY == "여기에_서울시_API_키_입력":
        print("⚠️ 서울시 API 키가 설정되지 않았습니다.")
        print("config.py 파일에서 SEOUL_API_KEY를 설정해주세요.")
        return []

    # 현재 날짜 기준 1년 데이터 수집
    today = datetime.now()
    start_date = (today - timedelta(days=30)).strftime("%Y%m%d")  # 1개월 전부터
    end_date = (today + timedelta(days=365)).strftime("%Y%m%d")   # 1년 후까지

    url = SEOUL_FESTIVAL_URL.format(
        key=SEOUL_API_KEY,
        start_date=start_date,
        end_date=end_date
    )

    all_festivals = []

    try:
        print(f"  📅 기간: {start_date} ~ {end_date}")
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # API 응답 구조 확인
        if "culturalEventInfo" in data:
            result = data["culturalEventInfo"]

            # RESULT 코드 확인
            if "RESULT" in result:
                result_code = result["RESULT"]["CODE"]
                if result_code != "INFO-000":
                    print(f"  ⚠️ API 오류: {result['RESULT']['MESSAGE']}")
                    return []

            # 데이터 추출
            rows = result.get("row", [])
            all_festivals.extend(rows)
            print(f"  ✅ {len(rows)}개 축제 수집 완료")
        else:
            print(f"  ⚠️ 예상치 못한 응답 구조: {data.keys()}")

    except requests.exceptions.RequestException as e:
        print(f"  ❌ 축제 데이터 수집 실패: {e}")
    except Exception as e:
        print(f"  ❌ 데이터 처리 오류: {e}")

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
            print(f"  🔍 [{idx}/{total}] {title} 검색량 조회 중...")
            buzz_score = get_buzz_score(title)

            # 데이터 정제
            processed.append({
                "season": season,
                "GUNAME": item.get("GUNAME", ""),
                "TITLE": title,
                "DATE": item.get("DATE", ""),
                "PLACE": item.get("PLACE", ""),
                "ORG_NAME": item.get("ORG_NAME", ""),
                "USE_TRGT": item.get("USE_TRGT", ""),
                "MAIN_IMG": item.get("MAIN_IMG", ""),
                "IS_FREE": item.get("IS_FREE", ""),
                "HMPG_ADDR": item.get("HMPG_ADDR", ""),
                "PROGRAM": item.get("PROGRAM", ""),
                "STRTDATE": item.get("STRTDATE", ""),
                "END_DATE": item.get("END_DATE", ""),
                "buzz_score": buzz_score
            })

            # API 호출 제한 준수 (QPS 10 = 0.1초 간격)
            if NAVER_CLIENT_ID != "여기에_네이버_클라이언트_ID_입력":
                time.sleep(0.1)

        except Exception as e:
            print(f"  ⚠️ 데이터 처리 오류 (항목 {idx}): {e}")
            continue

    return processed


def fetch_and_save():
    """전체 프로세스 실행: 수집 → 처리 → 저장"""
    print("\n" + "="*60)
    print("📅 축제 데이터 수집 시작")
    print("="*60)

    # 1. 데이터 수집
    raw = fetch_festivals()
    if not raw:
        print("  ⚠️ 수집된 데이터가 없습니다.")
        print("  💡 generate_sample_data.py를 실행하여 샘플 데이터를 생성하세요.")
        return

    print(f"\n✅ 총 {len(raw)}개 축제 수집 완료\n")

    # 2. 관심도 점수 계산
    print("🔍 관심도 점수 계산 중...")
    processed = process_festivals(raw)

    # 3. 저장
    SAVE_PATH.mkdir(parents=True, exist_ok=True)
    output_file = SAVE_PATH / "festival_data.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(processed, f, ensure_ascii=False, indent=2)

    print(f"\n💾 저장 완료: {output_file}")
    print(f"📊 총 {len(processed)}개 축제 데이터 저장")
    print("="*60 + "\n")


if __name__ == "__main__":
    fetch_and_save()
