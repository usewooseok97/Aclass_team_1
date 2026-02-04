"""
API 키 및 설정 관리
환경변수(.env 파일)에서 API 키를 관리합니다.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# ===== API 키 설정 =====
# 환경변수에서 API 키 읽기
SEOUL_API_KEY = os.getenv("SEOUL_API_KEY")
NAVER_CLIENT_ID = os.getenv("NAVER_CLIENT_ID")
NAVER_CLIENT_SECRET = os.getenv("NAVER_CLIENT_SECRET")
KMA_API_KEY = os.getenv("KMA_API_KEY")
GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")

# ===== Supabase 설정 =====
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")


def validate_keys():
    """API 키 유효성 검사"""
    missing = []
    if not SEOUL_API_KEY:
        missing.append("SEOUL_API_KEY")
    if not NAVER_CLIENT_ID:
        missing.append("NAVER_CLIENT_ID")
    if not NAVER_CLIENT_SECRET:
        missing.append("NAVER_CLIENT_SECRET")
    if not KMA_API_KEY:
        missing.append("KMA_API_KEY")

    if missing:
        raise ValueError(
            f"Missing API keys: {', '.join(missing)}\n"
            f".env 파일에 API 키를 입력해주세요."
        )


# ===== 저장 경로 설정 =====
BASE_DIR = Path(__file__).parent
SAVE_PATH = BASE_DIR.parent / "public" / "data"

# ===== API 엔드포인트 =====
# 서울시 문화행사 정보 API
# 형식: http://openapi.seoul.go.kr:8088/{KEY}/{TYPE}/{SERVICE}/{START_INDEX}/{END_INDEX}/
SEOUL_FESTIVAL_URL = "http://openapi.seoul.go.kr:8088/{key}/json/culturalEventInfo/{start}/{end}/"

# 네이버 검색 API
NAVER_BLOG_SEARCH_URL = "https://openapi.naver.com/v1/search/blog.json"
NAVER_LOCAL_SEARCH_URL = "https://openapi.naver.com/v1/search/local.json"

# 기상청 초단기실황 API
KMA_WEATHER_URL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst"

# Google Places API (New)
GOOGLE_PLACES_TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"


# ===== 서울 격자 좌표 (기상청 API용) =====
# 서울시청 기준 격자 좌표
SEOUL_GRID = {"nx": 60, "ny": 127}
