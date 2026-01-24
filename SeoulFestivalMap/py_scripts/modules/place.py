"""
맛집/카페 데이터 수집 모듈
네이버 지역검색 API를 사용하여 각 축제 주변의 맛집과 카페 정보를 수집합니다.
"""

import requests
import json
import time
import math
import sys
import os

# 상위 디렉토리의 config 모듈 import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import (
    NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET,
    NAVER_LOCAL_SEARCH_URL,
    GOOGLE_PLACES_API_KEY,
    GOOGLE_PLACES_TEXT_SEARCH_URL,
    SAVE_PATH
)


def naver_to_wgs84(mapx: str, mapy: str) -> tuple:
    """
    네이버 좌표를 WGS84 좌표로 변환

    Args:
        mapx (str): 네이버 경도 (예: "1270249425")
        mapy (str): 네이버 위도 (예: "375193887")

    Returns:
        tuple: (lat, lng) - WGS84 좌표
    """
    if not mapx or not mapy:
        return None, None
    try:
        lng = int(mapx) / 10000000  # 경도
        lat = int(mapy) / 10000000  # 위도
        return lat, lng
    except:
        return None, None


def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Haversine 공식으로 두 좌표 간 거리 계산 (미터)

    Args:
        lat1, lng1: 첫 번째 좌표
        lat2, lng2: 두 번째 좌표

    Returns:
        float: 거리 (미터)
    """
    if None in (lat1, lng1, lat2, lng2):
        return float('inf')

    R = 6371000  # 지구 반경 (미터)

    d_lat = math.radians(lat2 - lat1)
    d_lng = math.radians(lng2 - lng1)

    a = (math.sin(d_lat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(d_lng / 2) ** 2)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c


def fetch_google_photos(place_name, address):
    """
    Google Places API를 사용하여 장소 사진 정보 가져오기

    Args:
        place_name (str): 장소 이름
        address (str): 장소 주소

    Returns:
        dict: googlePlaceId와 photos 정보
    """
    if not GOOGLE_PLACES_API_KEY:
        return {"googlePlaceId": None, "photos": []}

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.photos"
    }

    # 검색 쿼리: 이름 + 주소
    query = f"{place_name} {address}"

    payload = {
        "textQuery": query,
        "languageCode": "ko"
    }

    try:
        response = requests.post(
            GOOGLE_PLACES_TEXT_SEARCH_URL,
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        data = response.json()

        places = data.get("places", [])
        if not places:
            return {"googlePlaceId": None, "photos": []}

        place = places[0]
        place_id = place.get("id", "")

        # photos 배열에서 최대 5개 추출
        photos_raw = place.get("photos", [])[:5]
        photos = [
            {
                "name": p.get("name", ""),
                "widthPx": p.get("widthPx", 0),
                "heightPx": p.get("heightPx", 0)
            }
            for p in photos_raw
        ]

        return {
            "googlePlaceId": place_id,
            "photos": photos
        }

    except Exception as e:
        print(f"      [WARN] Google Places 검색 실패 ({place_name}): {e}")
        return {"googlePlaceId": None, "photos": []}


def fetch_places_for_festival(festival_title, gu_name, place_name="", festival_mapx="", festival_mapy="", max_distance=100):
    """
    특정 축제 주변 맛집/카페 검색

    Args:
        festival_title (str): 축제 제목
        gu_name (str): 자치구 이름 (예: "종로구")
        place_name (str): 축제 장소명 (예: "코엑스")
        festival_mapx (str): 축제 경도 (네이버 좌표)
        festival_mapy (str): 축제 위도 (네이버 좌표)
        max_distance (int): 최대 거리 (미터), 기본 100m

    Returns:
        list: 맛집/카페 정보 리스트 (거리 이내만)
    """

    # API 키 확인
    if NAVER_CLIENT_ID == "여기에_네이버_클라이언트_ID_입력":
        return []

    headers = {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET
    }

    # 축제 좌표를 WGS84로 변환
    festival_lat, festival_lng = naver_to_wgs84(festival_mapx, festival_mapy)
    has_festival_coords = festival_lat is not None and festival_lng is not None

    # 검색 쿼리: 축제 장소명이 있으면 더 정확한 검색
    if place_name:
        queries = [
            f"{place_name} 근처 카페",
            f"{place_name} 근처 맛집",
            f"{gu_name} {place_name} 카페",
            f"{gu_name} {place_name} 맛집"
        ]
    else:
        queries = [
            f"{gu_name} 카페",
            f"{gu_name} 맛집"
        ]

    places = []

    for query in queries:
        params = {
            "query": query,
            "display": 10,  # 더 많이 검색 (필터링 후 줄어들 수 있음)
            "sort": "random"
        }

        try:
            response = requests.get(NAVER_LOCAL_SEARCH_URL, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            items = data.get("items", [])

            for item in items:
                # HTML 태그 제거
                name = item["title"].replace("<b>", "").replace("</b>", "")
                address = item.get("roadAddress", "") or item.get("address", "")
                place_mapx = item.get("mapx", "")
                place_mapy = item.get("mapy", "")

                # 거리 필터링: 축제 좌표가 있으면 100m 이내만
                if has_festival_coords and place_mapx and place_mapy:
                    place_lat, place_lng = naver_to_wgs84(place_mapx, place_mapy)
                    if place_lat and place_lng:
                        distance = calculate_distance(festival_lat, festival_lng, place_lat, place_lng)
                        if distance > max_distance:
                            continue  # 거리 초과 → 스킵
                        print(f"      ✓ {name}: {distance:.0f}m")

                place_data = {
                    "name": name,
                    "category": item.get("category", ""),
                    "address": item.get("address", ""),
                    "roadAddress": item.get("roadAddress", ""),
                    "mapx": place_mapx,
                    "mapy": place_mapy,
                    "link": item.get("link", ""),
                    "telephone": item.get("telephone", ""),
                    "googlePlaceId": None,
                    "photos": []
                }

                # Google Places API로 사진 정보 가져오기
                if GOOGLE_PLACES_API_KEY:
                    google_data = fetch_google_photos(name, address)
                    place_data["googlePlaceId"] = google_data["googlePlaceId"]
                    place_data["photos"] = google_data["photos"]
                    time.sleep(0.1)  # API 호출 제한 준수

                places.append(place_data)

            # API 호출 제한 준수
            time.sleep(0.1)

        except Exception as e:
            print(f"  [WARN] 장소 검색 실패 ({query}): {e}")

    # 중복 제거 (이름 기준)
    seen = set()
    unique_places = []
    for p in places:
        if p["name"] not in seen:
            seen.add(p["name"])
            unique_places.append(p)

    return unique_places


def fetch_and_save():
    """전체 프로세스 실행: 축제 데이터 읽기 → 맛집 검색 → 저장"""
    print("\n" + "="*60)
    print("[PLACE] 맛집 데이터 수집 시작")
    print("="*60)

    # API 키 확인
    if NAVER_CLIENT_ID == "여기에_네이버_클라이언트_ID_입력":
        print("  [WARN] 네이버 API 키가 설정되지 않았습니다.")
        print("  config.py 파일에서 NAVER_CLIENT_ID와 NAVER_CLIENT_SECRET을 설정해주세요.")
        print("  또는 generate_sample_data.py를 실행하여 샘플 데이터를 생성하세요.")
        print("="*60 + "\n")
        return

    # festival_data.json 읽기
    festival_file = SAVE_PATH / "festival_data.json"

    if not festival_file.exists():
        print("  [WARN] festival_data.json 파일이 없습니다.")
        print("  먼저 festival.py를 실행하여 축제 데이터를 수집해주세요.")
        print("="*60 + "\n")
        return

    with open(festival_file, "r", encoding="utf-8") as f:
        festivals = json.load(f)

    print(f"  [INFO] {len(festivals)}개 축제 데이터 로드 완료\n")

    place_data = {}
    total = len(festivals)

    for idx, festival in enumerate(festivals, 1):
        title = festival["TITLE"]
        gu_name = festival["GUNAME"]
        place_name = festival.get("PLACE", "")
        festival_mapx = festival.get("mapx", "")
        festival_mapy = festival.get("mapy", "")

        print(f"  [{idx}/{total}] {title} ({gu_name})")
        if festival_mapx and festival_mapy:
            print(f"      축제 좌표: ({festival_mapx}, {festival_mapy})")
            print(f"      400m 이내 맛집 검색 중...")
        else:
            print(f"      [WARN] 축제 좌표 없음 - 구 단위 검색")

        places = fetch_places_for_festival(
            title,
            gu_name,
            place_name=place_name,
            festival_mapx=festival_mapx,
            festival_mapy=festival_mapy,
            max_distance=400
        )

        if places:
            place_data[title] = places
            print(f"      [OK] {len(places)}개 장소 발견 (400m 이내)")
        else:
            place_data[title] = []
            print(f"      [WARN] 400m 이내 맛집 없음")

    # 저장
    output_file = SAVE_PATH / "place_data.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(place_data, f, ensure_ascii=False, indent=2)

    print(f"\n[SAVED] {output_file}")
    print(f"[INFO] 총 {len(place_data)}개 축제의 맛집 데이터 저장")
    print("="*60 + "\n")


if __name__ == "__main__":
    fetch_and_save()
