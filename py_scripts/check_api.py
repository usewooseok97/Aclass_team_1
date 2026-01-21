"""
API 상태 확인 스크립트
각 API의 연결 상태와 응답을 빠르게 확인합니다.
"""

import requests
from datetime import datetime, timedelta
from config import (
    SEOUL_API_KEY,
    NAVER_CLIENT_ID,
    NAVER_CLIENT_SECRET,
    KMA_API_KEY,
    SEOUL_FESTIVAL_URL,
    NAVER_BLOG_SEARCH_URL,
    NAVER_LOCAL_SEARCH_URL,
    KMA_WEATHER_URL,
    SEOUL_GRID,
)


def print_header():
    print()
    print("=" * 42)
    print("           API 상태 확인")
    print("=" * 42)
    print()


def print_result(success_count, total):
    print()
    print("=" * 42)
    if success_count == total:
        print(f"  결과: {success_count}/{total} API 정상")
    else:
        print(f"  결과: {success_count}/{total} API 정상 ({total - success_count}개 실패)")
    print("=" * 42)
    print()


def check_seoul_api():
    """서울시 문화행사 API 확인"""
    print("[1/4] 서울시 문화행사 API")

    # 키 확인
    if not SEOUL_API_KEY:
        print("      키 설정: X (SEOUL_API_KEY 미설정)")
        print("      -> .env 파일에 SEOUL_API_KEY를 입력해주세요")
        return False
    print("      키 설정: O")

    # API 호출
    try:
        # 테스트용: 1~5건만 조회
        url = SEOUL_FESTIVAL_URL.format(
            key=SEOUL_API_KEY,
            start=1,
            end=5
        )

        response = requests.get(url, timeout=10)
        print("      연결 상태: O")

        data = response.json()

        # 최상위 RESULT 키 처리 (데이터 없음 또는 에러)
        if "RESULT" in data and "culturalEventInfo" not in data:
            code = data["RESULT"]["CODE"]
            msg = data["RESULT"].get("MESSAGE", "")

            if code == "INFO-200":
                # 데이터 없음 - API는 정상 동작
                print(f"      응답 코드: {code} (API 정상)")
                print("      축제 데이터: 0건 (현재 기간 데이터 없음)")
                return True
            elif code in ["INFO-100", "ERROR-300", "ERROR-301", "ERROR-310"]:
                # 인증 관련 오류
                print(f"      응답 코드: {code}")
                print(f"      -> API 키 오류: {msg}")
                return False
            else:
                print(f"      응답 코드: {code}")
                print(f"      -> 메시지: {msg}")
                return False

        # 정상 응답 구조
        if "culturalEventInfo" in data:
            result = data["culturalEventInfo"]
            if "RESULT" in result:
                code = result["RESULT"]["CODE"]
                msg = result["RESULT"]["MESSAGE"]
                if code == "INFO-000":
                    count = result.get("list_total_count", 0)
                    print(f"      응답 코드: {code} (정상)")
                    print(f"      축제 데이터: {count}건 확인")
                    return True
                else:
                    print(f"      응답 코드: {code}")
                    print(f"      -> 오류: {msg}")
                    return False
            else:
                count = result.get("list_total_count", 0)
                print("      응답 코드: 정상")
                print(f"      축제 데이터: {count}건 확인")
                return True
        else:
            print("      응답 구조: X (예상과 다름)")
            print(f"      -> 응답 키: {list(data.keys())}")
            return False

    except requests.exceptions.Timeout:
        print("      연결 상태: X (시간 초과)")
        return False
    except requests.exceptions.ConnectionError:
        print("      연결 상태: X (연결 실패)")
        return False
    except Exception as e:
        print(f"      오류: {str(e)}")
        return False


def check_naver_blog_api():
    """네이버 블로그 검색 API 확인"""
    print()
    print("[2/4] 네이버 블로그 검색 API")

    # 키 확인
    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        missing = []
        if not NAVER_CLIENT_ID:
            missing.append("NAVER_CLIENT_ID")
        if not NAVER_CLIENT_SECRET:
            missing.append("NAVER_CLIENT_SECRET")
        print(f"      키 설정: X ({', '.join(missing)} 미설정)")
        print("      -> .env 파일에 네이버 API 키를 입력해주세요")
        return False
    print("      키 설정: O")

    # API 호출
    try:
        headers = {
            "X-Naver-Client-Id": NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        }
        params = {"query": "서울 축제", "display": 1}

        response = requests.get(
            NAVER_BLOG_SEARCH_URL,
            headers=headers,
            params=params,
            timeout=10
        )
        print("      연결 상태: O")

        if response.status_code == 200:
            data = response.json()
            total = data.get("total", 0)
            print(f"      응답 상태: {response.status_code} OK")
            print(f"      검색 결과: {total}건 확인")
            return True
        else:
            print(f"      응답 상태: {response.status_code}")
            try:
                error = response.json()
                print(f"      -> 오류: {error.get('errorMessage', '알 수 없음')}")
            except:
                pass
            return False

    except requests.exceptions.Timeout:
        print("      연결 상태: X (시간 초과)")
        return False
    except requests.exceptions.ConnectionError:
        print("      연결 상태: X (연결 실패)")
        return False
    except Exception as e:
        print(f"      오류: {str(e)}")
        return False


def check_naver_local_api():
    """네이버 지역 검색 API 확인"""
    print()
    print("[3/4] 네이버 지역 검색 API")

    # 키 확인
    if not NAVER_CLIENT_ID or not NAVER_CLIENT_SECRET:
        missing = []
        if not NAVER_CLIENT_ID:
            missing.append("NAVER_CLIENT_ID")
        if not NAVER_CLIENT_SECRET:
            missing.append("NAVER_CLIENT_SECRET")
        print(f"      키 설정: X ({', '.join(missing)} 미설정)")
        print("      -> .env 파일에 네이버 API 키를 입력해주세요")
        return False
    print("      키 설정: O")

    # API 호출
    try:
        headers = {
            "X-Naver-Client-Id": NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        }
        params = {"query": "강남구 맛집", "display": 1}

        response = requests.get(
            NAVER_LOCAL_SEARCH_URL,
            headers=headers,
            params=params,
            timeout=10
        )
        print("      연결 상태: O")

        if response.status_code == 200:
            data = response.json()
            total = data.get("total", 0)
            print(f"      응답 상태: {response.status_code} OK")
            print(f"      검색 결과: {total}건 확인")
            return True
        else:
            print(f"      응답 상태: {response.status_code}")
            try:
                error = response.json()
                print(f"      -> 오류: {error.get('errorMessage', '알 수 없음')}")
            except:
                pass
            return False

    except requests.exceptions.Timeout:
        print("      연결 상태: X (시간 초과)")
        return False
    except requests.exceptions.ConnectionError:
        print("      연결 상태: X (연결 실패)")
        return False
    except Exception as e:
        print(f"      오류: {str(e)}")
        return False


def check_kma_api():
    """기상청 단기실황 API 확인"""
    print()
    print("[4/4] 기상청 단기실황 API")

    # 키 확인
    if not KMA_API_KEY:
        print("      키 설정: X (KMA_API_KEY 미설정)")
        print("      -> .env 파일에 KMA_API_KEY를 입력해주세요")
        return False
    print("      키 설정: O")

    # API 호출
    try:
        now = datetime.now()
        base_date = now.strftime("%Y%m%d")

        # 기상청 API는 매시각 10분에 발표
        base_hour = now.hour - 1
        if base_hour < 0:
            base_hour = 23
            base_date = (now - timedelta(days=1)).strftime("%Y%m%d")
        base_time = f"{base_hour:02d}00"

        url = f"{KMA_WEATHER_URL}/getUltraSrtNcst"
        params = {
            "serviceKey": KMA_API_KEY,
            "pageNo": 1,
            "numOfRows": 10,
            "dataType": "JSON",
            "base_date": base_date,
            "base_time": base_time,
            "nx": SEOUL_GRID["nx"],
            "ny": SEOUL_GRID["ny"],
        }

        response = requests.get(url, params=params, timeout=10)
        print("      연결 상태: O")

        data = response.json()

        if "response" in data:
            header = data["response"]["header"]
            result_code = header.get("resultCode", "")
            result_msg = header.get("resultMsg", "")

            if result_code == "00":
                items = data["response"]["body"]["items"]["item"]
                print(f"      응답 코드: {result_code} (정상)")
                print(f"      날씨 데이터: {len(items)}개 항목 확인")
                return True
            else:
                print(f"      응답 코드: {result_code}")
                print(f"      -> 오류: {result_msg}")
                return False
        else:
            print("      응답 구조: X (예상과 다름)")
            print(f"      -> 응답 키: {list(data.keys())}")
            return False

    except requests.exceptions.Timeout:
        print("      연결 상태: X (시간 초과)")
        return False
    except requests.exceptions.ConnectionError:
        print("      연결 상태: X (연결 실패)")
        return False
    except Exception as e:
        print(f"      오류: {str(e)}")
        return False


def main():
    print_header()

    results = []
    results.append(check_seoul_api())
    results.append(check_naver_blog_api())
    results.append(check_naver_local_api())
    results.append(check_kma_api())

    success_count = sum(results)
    print_result(success_count, len(results))

    return 0 if success_count == len(results) else 1


if __name__ == "__main__":
    exit(main())
