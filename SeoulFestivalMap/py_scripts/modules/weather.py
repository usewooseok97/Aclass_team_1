"""
날씨 데이터 수집 모듈
기상청 단기실황 API를 사용하여 서울의 현재 날씨 정보를 수집합니다.
"""

import requests
import json
from datetime import datetime
import sys
import os

# 상위 디렉토리의 config 모듈 import
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import (
    KMA_API_KEY,
    KMA_WEATHER_URL,
    SEOUL_GRID,
    SAVE_PATH
)


def get_sky_condition(pty, sky):
    """
    강수형태(PTY)와 하늘상태(SKY) 코드를 문자열로 변환

    Args:
        pty: 강수형태 (0: 없음, 1: 비, 2: 비/눈, 3: 눈, 5: 빗방울, 6: 빗방울눈날림, 7: 눈날림)
        sky: 하늘상태 (1: 맑음, 3: 구름많음, 4: 흐림)

    Returns:
        str: 날씨 상태 문자열
    """
    if pty == 0:  # 강수 없음
        if sky == 1:
            return "맑음"
        elif sky == 3:
            return "구름많음"
        else:
            return "흐림"
    elif pty == 1:
        return "비"
    elif pty == 2:
        return "비/눈"
    elif pty == 3:
        return "눈"
    elif pty == 5:
        return "빗방울"
    elif pty == 6:
        return "빗방울눈날림"
    elif pty == 7:
        return "눈날림"
    else:
        return "알 수 없음"


def fetch_weather():
    """기상청 단기실황 API 호출"""

    # API 키 확인
    if KMA_API_KEY == "여기에_기상청_API_키_입력":
        print("  [WARN] 기상청 API 키가 설정되지 않았습니다.")
        return None

    now = datetime.now()
    base_date = now.strftime("%Y%m%d")

    # 기상청 API는 매시각 10분에 발표되므로, 현재 시각 - 1시간 데이터 조회
    base_hour = now.hour - 1
    if base_hour < 0:
        base_hour = 23
        # 어제 날짜로 조정
        from datetime import timedelta
        yesterday = now - timedelta(days=1)
        base_date = yesterday.strftime("%Y%m%d")

    base_time = f"{base_hour:02d}00"

    params = {
        "serviceKey": KMA_API_KEY,
        "pageNo": 1,
        "numOfRows": 100,
        "dataType": "JSON",
        "base_date": base_date,
        "base_time": base_time,
        "nx": SEOUL_GRID["nx"],
        "ny": SEOUL_GRID["ny"]
    }

    try:
        response = requests.get(KMA_WEATHER_URL, params=params)
        response.raise_for_status()
        data = response.json()

        # 응답 구조 확인
        if "response" not in data:
            print(f"  [WARN] 예상치 못한 응답 구조: {data.keys()}")
            return None

        header = data["response"]["header"]
        if header["resultCode"] != "00":
            print(f"  [WARN] API 오류: {header['resultMsg']}")
            return None

        items = data["response"]["body"]["items"]["item"]

        # 데이터 파싱
        weather_data = {
            "lastUpdated": now.isoformat(),
            "current": {},
            "forecast": {}
        }

        # 카테고리별 데이터 추출
        for item in items:
            category = item["category"]
            value = item["obsrValue"]

            if category == "T1H":  # 기온
                weather_data["current"]["temperature"] = float(value)
            elif category == "REH":  # 습도
                weather_data["current"]["humidity"] = int(value)
            elif category == "WSD":  # 풍속
                weather_data["current"]["windSpeed"] = float(value)
            elif category == "PTY":  # 강수형태
                weather_data["current"]["pty"] = int(value)
            elif category == "SKY":  # 하늘상태
                weather_data["current"]["skyCom"] = int(value)

        # 하늘 상태 문자열 생성
        pty = weather_data["current"].get("pty", 0)
        sky_code = weather_data["current"].get("skyCode", 1)
        weather_data["current"]["sky"] = get_sky_condition(pty, sky_code)

        # forecast는 단기실황에서 제공하지 않으므로 기본값 설정
        weather_data["forecast"] = {
            "maxTemp": weather_data["current"].get("temperature", 0) + 3,
            "minTemp": weather_data["current"].get("temperature", 0) - 3,
            "sky": weather_data["current"]["sky"]
        }

        return weather_data

    except Exception as e:
        print(f"  [ERROR] 날씨 데이터 수집 실패: {e}")
        return None


def fetch_and_save():
    """전체 프로세스 실행: 날씨 데이터 수집 → 저장"""
    print("\n" + "="*60)
    print("[WEATHER] 날씨 데이터 수집 시작")
    print("="*60)

    # API 키 확인
    if KMA_API_KEY == "여기에_기상청_API_키_입력":
        print("  config.py 파일에서 KMA_API_KEY를 설정해주세요.")
        print("  또는 generate_sample_data.py를 실행하여 샘플 데이터를 생성하세요.")

        # 기본 데이터 생성
        weather_data = {
            "lastUpdated": datetime.now().isoformat(),
            "current": {
                "temperature": 10,
                "sky": "맑음",
                "humidity": 50,
                "windSpeed": 2.0
            },
            "forecast": {
                "maxTemp": 13,
                "minTemp": 7,
                "sky": "맑음"
            }
        }
    else:
        weather_data = fetch_weather()

        if not weather_data:
            print("  [WARN] 날씨 데이터 수집 실패. 기본값 사용")
            weather_data = {
                "lastUpdated": datetime.now().isoformat(),
                "current": {
                    "temperature": 10,
                    "sky": "알 수 없음",
                    "humidity": 50
                }
            }

    # 저장
    SAVE_PATH.mkdir(parents=True, exist_ok=True)
    output_file = SAVE_PATH / "weather_data.json"

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(weather_data, f, ensure_ascii=False, indent=2)

    print(f"\n[SAVED] {output_file}")
    print(f"[INFO] 현재 온도: {weather_data['current'].get('temperature', 'N/A')}C")
    print(f"[INFO] 날씨: {weather_data['current'].get('sky', 'N/A')}")
    print("="*60 + "\n")


if __name__ == "__main__":
    fetch_and_save()
