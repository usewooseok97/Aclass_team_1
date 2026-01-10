"""
맛집/카페 데이터 수집 모듈
네이버 지역검색 API를 사용하여 각 축제 주변의 맛집과 카페 정보를 수집합니다.
"""

import requests
import json
import time
import sys
import os

# 상위 디렉토리의 config 모듈 import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import (
    NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET,
    NAVER_LOCAL_SEARCH_URL,
    SAVE_PATH
)


def fetch_places_for_festival(festival_title, gu_name):
    """
    특정 축제 주변 맛집/카페 검색

    Args:
        festival_title (str): 축제 제목
        gu_name (str): 자치구 이름 (예: "종로구")

    Returns:
        list: 맛집/카페 정보 리스트 (최대 10개)
    """

    # API 키 확인
    if NAVER_CLIENT_ID == "여기에_네이버_클라이언트_ID_입력":
        return []

    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }

    # 검색 쿼리: "구명 + 카페" 또는 "구명 + 맛집"
    queries = [
        f"{gu_name} 카페",
        f"{gu_name} 맛집"
    ]

    places = []

    for query in queries:
        params = {
            "query": query,
            "display": 5,  # 각 카테고리당 5개
            "sort": "random"  # 랜덤 정렬
        }

        try:
            response = requests.get(NAVER_LOCAL_SEARCH_URL, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            items = data.get("items", [])

            for item in items:
                # HTML 태그 제거
                name = item["title"].replace("<b>", "").replace("</b>", "")

                places.append({
                    "name": name,
                    "category": item.get("category", ""),
                    "address": item.get("address", ""),
                    "roadAddress": item.get("roadAddress", ""),
                    "mapx": item.get("mapx", ""),
                    "mapy": item.get("mapy", ""),
                    "link": item.get("link", ""),
                    "telephone": item.get("telephone", "")
                })

            # API 호출 제한 준수
            time.sleep(0.1)

        except Exception as e:
            print(f"  ⚠️ 장소 검색 실패 ({query}): {e}")

    # 중복 제거 (이름 기준)
    seen = set()
    unique_places = []
    for p in places:
        if p["name"] not in seen:
            seen.add(p["name"])
            unique_places.append(p)

    return unique_places[:10]  # 최대 10개


def fetch_and_save():
    """전체 프로세스 실행: 축제 데이터 읽기 → 맛집 검색 → 저장"""
    print("\n" + "="*60)
    print("🍽️ 맛집 데이터 수집 시작")
    print("="*60)

    # API 키 확인
    if NAVER_CLIENT_ID == "여기에_네이버_클라이언트_ID_입력":
        print("  ⚠️ 네이버 API 키가 설정되지 않았습니다.")
        print("  💡 config.py 파일에서 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 설정해주세요.")
        print("  💡 또는 generate_sample_data.py를 실행하여 샘플 데이터를 생성하세요.")
        print("="*60 + "\n")
        return

    # festival_data.json 읽기
    festival_file = SAVE_PATH / "festival_data.json"

    if not festival_file.exists():
        print("  ⚠️ festival_data.json 파일이 없습니다.")
        print("  💡 먼저 festival.py를 실행하여 축제 데이터를 수집해주세요.")
        print("="*60 + "\n")
        return

    with open(festival_file, "r", encoding="utf-8") as f:
        festivals = json.load(f)

    print(f"  📂 {len(festivals)}개 축제 데이터 로드 완료\n")

    place_data = {}
    total = len(festivals)

    for idx, festival in enumerate(festivals, 1):
        title = festival["TITLE"]
        gu_name = festival["GUNAME"]

        print(f"  🔍 [{idx}/{total}] {title} ({gu_name}) 검색 중...")

        places = fetch_places_for_festival(title, gu_name)

        if places:
            place_data[title] = places
            print(f"      ✅ {len(places)}개 장소 발견")
        else:
            place_data[title] = []
            print(f"      ⚠️ 검색 결과 없음")

    # 저장
    output_file = SAVE_PATH / "place_data.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(place_data, f, ensure_ascii=False, indent=2)

    print(f"\n💾 저장 완료: {output_file}")
    print(f"📊 총 {len(place_data)}개 축제의 맛집 데이터 저장")
    print("="*60 + "\n")


if __name__ == "__main__":
    fetch_and_save()
