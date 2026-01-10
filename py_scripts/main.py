"""
데이터 파이프라인 메인 실행 파일
축제, 맛집, 날씨 데이터를 순차적으로 수집합니다.
"""

import sys
from datetime import datetime
from modules import festival, place, weather


def main():
    """전체 데이터 파이프라인 실행"""
    print("\n" + "="*60)
    print("🚀 서울 페스타 데이터 파이프라인 실행 시작")
    print(f"⏰ 실행 시각: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)

    try:
        # 1. 축제 데이터 수집
        print("\n[1/3] 축제 데이터 수집")
        festival.fetch_and_save()

        # 2. 맛집 데이터 수집 (축제 데이터 필요)
        print("\n[2/3] 맛집 데이터 수집")
        place.fetch_and_save()

        # 3. 날씨 데이터 수집
        print("\n[3/3] 날씨 데이터 수집")
        weather.fetch_and_save()

        print("\n" + "="*60)
        print("✅ 모든 데이터 수집 완료!")
        print("="*60 + "\n")

        return 0

    except KeyboardInterrupt:
        print("\n\n⚠️ 사용자에 의해 중단되었습니다.")
        return 1

    except Exception as e:
        print(f"\n❌ 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        return 1


if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
