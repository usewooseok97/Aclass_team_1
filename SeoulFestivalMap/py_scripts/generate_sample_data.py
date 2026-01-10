"""
샘플 데이터 생성 스크립트
API 키가 없을 때 테스트용 샘플 데이터를 생성합니다.
"""

import json
from datetime import datetime
from pathlib import Path
from config import SAVE_PATH


# 샘플 축제 데이터
SAMPLE_FESTIVALS = [
    {
        "season": "봄",
        "GUNAME": "종로구",
        "TITLE": "서울빛초롱축제",
        "DATE": "2025-03-01 ~ 2025-03-31",
        "PLACE": "청계천 일대",
        "ORG_NAME": "서울특별시 종로구",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "무료",
        "HMPG_ADDR": "",
        "PROGRAM": "등불 전시, 야간 조명",
        "STRTDATE": "20250301",
        "END_DATE": "20250331",
        "buzz_score": 78
    },
    {
        "season": "봄",
        "GUNAME": "강남구",
        "TITLE": "강남 봄꽃 축제",
        "DATE": "2025-04-10 ~ 2025-04-20",
        "PLACE": "양재천 일대",
        "ORG_NAME": "서울특별시 강남구",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "무료",
        "HMPG_ADDR": "",
        "PROGRAM": "벚꽃 전시, 음악 공연",
        "STRTDATE": "20250410",
        "END_DATE": "20250420",
        "buzz_score": 85
    },
    {
        "season": "여름",
        "GUNAME": "마포구",
        "TITLE": "한강 여름 축제",
        "DATE": "2025-07-15 ~ 2025-08-15",
        "PLACE": "한강공원 여의도",
        "ORG_NAME": "서울특별시 마포구",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "무료",
        "HMPG_ADDR": "",
        "PROGRAM": "물놀이, 수상 스포츠 체험",
        "STRTDATE": "20250715",
        "END_DATE": "20250815",
        "buzz_score": 92
    },
    {
        "season": "가을",
        "GUNAME": "종로구",
        "TITLE": "서울 등축제",
        "DATE": "2025-10-01 ~ 2025-11-15",
        "PLACE": "청계천",
        "ORG_NAME": "서울특별시",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "무료",
        "HMPG_ADDR": "",
        "PROGRAM": "전통 등 전시, 야경 투어",
        "STRTDATE": "20251001",
        "END_DATE": "20251115",
        "buzz_score": 88
    },
    {
        "season": "겨울",
        "GUNAME": "송파구",
        "TITLE": "잠실 겨울 축제",
        "DATE": "2025-12-15 ~ 2026-01-31",
        "PLACE": "잠실 종합운동장",
        "ORG_NAME": "서울특별시 송파구",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "유료",
        "HMPG_ADDR": "",
        "PROGRAM": "스케이트장, 눈 조각 전시",
        "STRTDATE": "20251215",
        "END_DATE": "20260131",
        "buzz_score": 75
    },
    {
        "season": "봄",
        "GUNAME": "용산구",
        "TITLE": "용산 벚꽃 축제",
        "DATE": "2025-04-01 ~ 2025-04-15",
        "PLACE": "용산공원",
        "ORG_NAME": "서울특별시 용산구",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "무료",
        "HMPG_ADDR": "",
        "PROGRAM": "벚꽃 산책로, 플리마켓",
        "STRTDATE": "20250401",
        "END_DATE": "20250415",
        "buzz_score": 72
    },
    {
        "season": "여름",
        "GUNAME": "서초구",
        "TITLE": "반포 한강 불꽃 축제",
        "DATE": "2025-08-01 ~ 2025-08-01",
        "PLACE": "반포 한강공원",
        "ORG_NAME": "서울특별시 서초구",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "무료",
        "HMPG_ADDR": "",
        "PROGRAM": "불꽃놀이, 음악 공연",
        "STRTDATE": "20250801",
        "END_DATE": "20250801",
        "buzz_score": 95
    },
    {
        "season": "가을",
        "GUNAME": "광진구",
        "TITLE": "서울 재즈 페스티벌",
        "DATE": "2025-10-10 ~ 2025-10-12",
        "PLACE": "올림픽공원",
        "ORG_NAME": "서울특별시 광진구",
        "USE_TRGT": "누구나",
        "MAIN_IMG": "https://via.placeholder.com/400",
        "IS_FREE": "유료",
        "HMPG_ADDR": "",
        "PROGRAM": "재즈 공연, 푸드트럭",
        "STRTDATE": "20251010",
        "END_DATE": "20251012",
        "buzz_score": 90
    }
]

# 샘플 맛집 데이터
SAMPLE_PLACES = {
    "서울빛초롱축제": [
        {
            "name": "청계천 카페",
            "category": "카페",
            "address": "서울특별시 종로구 청계천로 123",
            "roadAddress": "서울특별시 종로구 청계천로 123",
            "mapx": "126.9784",
            "mapy": "37.5704",
            "link": "",
            "telephone": "02-1234-5678"
        },
        {
            "name": "종로 맛집",
            "category": "한식",
            "address": "서울특별시 종로구 종로 456",
            "roadAddress": "서울특별시 종로구 종로 456",
            "mapx": "126.9850",
            "mapy": "37.5720",
            "link": "",
            "telephone": "02-2345-6789"
        }
    ],
    "강남 봄꽃 축제": [
        {
            "name": "양재천 브런치 카페",
            "category": "카페",
            "address": "서울특별시 강남구 양재천로 789",
            "roadAddress": "서울특별시 강남구 양재천로 789",
            "mapx": "127.0330",
            "mapy": "37.4765",
            "link": "",
            "telephone": "02-3456-7890"
        }
    ],
    "한강 여름 축제": [
        {
            "name": "한강뷰 레스토랑",
            "category": "양식",
            "address": "서울특별시 마포구 여의도로 101",
            "roadAddress": "서울특별시 마포구 여의도로 101",
            "mapx": "126.9320",
            "mapy": "37.5290",
            "link": "",
            "telephone": "02-4567-8901"
        }
    ],
    "서울 등축제": [
        {
            "name": "청계천 한식당",
            "category": "한식",
            "address": "서울특별시 종로구 청계천로 201",
            "roadAddress": "서울특별시 종로구 청계천로 201",
            "mapx": "126.9790",
            "mapy": "37.5710",
            "link": "",
            "telephone": "02-5678-9012"
        }
    ],
    "잠실 겨울 축제": [
        {
            "name": "잠실 핫초코 전문점",
            "category": "카페",
            "address": "서울특별시 송파구 올림픽로 301",
            "roadAddress": "서울특별시 송파구 올림픽로 301",
            "mapx": "127.0730",
            "mapy": "37.5145",
            "link": "",
            "telephone": "02-6789-0123"
        }
    ],
    "용산 벚꽃 축제": [
        {
            "name": "용산 디저트 카페",
            "category": "카페",
            "address": "서울특별시 용산구 이태원로 401",
            "roadAddress": "서울특별시 용산구 이태원로 401",
            "mapx": "126.9940",
            "mapy": "37.5340",
            "link": "",
            "telephone": "02-7890-1234"
        }
    ],
    "반포 한강 불꽃 축제": [
        {
            "name": "반포 루프탑 바",
            "category": "주점",
            "address": "서울특별시 서초구 반포대로 501",
            "roadAddress": "서울특별시 서초구 반포대로 501",
            "mapx": "127.0070",
            "mapy": "37.5080",
            "link": "",
            "telephone": "02-8901-2345"
        }
    ],
    "서울 재즈 페스티벌": [
        {
            "name": "올림픽공원 푸드코트",
            "category": "분식",
            "address": "서울특별시 송파구 올림픽로 601",
            "roadAddress": "서울특별시 송파구 올림픽로 601",
            "mapx": "127.1230",
            "mapy": "37.5205",
            "link": "",
            "telephone": "02-9012-3456"
        }
    ]
}

# 샘플 날씨 데이터
SAMPLE_WEATHER = {
    "lastUpdated": datetime.now().isoformat(),
    "current": {
        "temperature": 12,
        "sky": "맑음",
        "humidity": 45,
        "windSpeed": 2.5
    },
    "forecast": {
        "maxTemp": 15,
        "minTemp": 8,
        "sky": "구름많음"
    }
}


def generate_sample_data():
    """샘플 데이터 생성 및 저장"""
    print("\n" + "="*60)
    print("📦 샘플 데이터 생성 시작")
    print("="*60)

    # 저장 경로 생성
    SAVE_PATH.mkdir(parents=True, exist_ok=True)

    # 1. 축제 데이터 저장
    festival_file = SAVE_PATH / "festival_data.json"
    with open(festival_file, "w", encoding="utf-8") as f:
        json.dump(SAMPLE_FESTIVALS, f, ensure_ascii=False, indent=2)
    print(f"\n✅ 축제 데이터 생성: {festival_file}")
    print(f"   📊 {len(SAMPLE_FESTIVALS)}개 축제")

    # 2. 맛집 데이터 저장
    place_file = SAVE_PATH / "place_data.json"
    with open(place_file, "w", encoding="utf-8") as f:
        json.dump(SAMPLE_PLACES, f, ensure_ascii=False, indent=2)
    print(f"\n✅ 맛집 데이터 생성: {place_file}")
    print(f"   🍽️ {len(SAMPLE_PLACES)}개 축제의 맛집 정보")

    # 3. 날씨 데이터 저장
    weather_file = SAVE_PATH / "weather_data.json"
    with open(weather_file, "w", encoding="utf-8") as f:
        json.dump(SAMPLE_WEATHER, f, ensure_ascii=False, indent=2)
    print(f"\n✅ 날씨 데이터 생성: {weather_file}")
    print(f"   🌡️ 현재 온도: {SAMPLE_WEATHER['current']['temperature']}°C")

    print("\n" + "="*60)
    print("✅ 샘플 데이터 생성 완료!")
    print("💡 이제 Frontend 개발 서버를 실행하여 확인하세요.")
    print("="*60 + "\n")


if __name__ == "__main__":
    generate_sample_data()
