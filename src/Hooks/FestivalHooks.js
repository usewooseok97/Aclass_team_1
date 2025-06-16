import { useContext, useEffect, useMemo } from "react";
import { FestivalContext } from "../App";

// ✅ 축제 관련 UI 상태 및 필터링 로직을 처리하는 커스텀 훅
export function useFestivalUI() {
  // 🔸 Context에서 전역 상태와 상태 업데이트 함수들을 불러옴
  const {
    festivalData,              // 전체 축제 데이터: { all: [], bySeason: {...} }
    setCurrentSeason,          // 현재 계절 변경 함수
    currentSeason,             // 현재 선택된 계절 ("봄", "여름", "가을", "겨울")
    selectedDistrict,          // 현재 선택된 자치구 (ex. "강남구")
    setSelectedDistrict,       // 자치구 선택 변경 함수
    selectedFestival,          // 상세보기용으로 선택된 축제 객체
    setSelectedFestival,       // 축제 상세 선택 변경 함수
    topDistricts,              // 현재 계절에서 평점 상위 3개 자치구
    setTopDistricts,           // 상위 구 업데이트 함수
    sidebarVisible,            // 사이드바 표시 여부
    setSidebarVisible,         // 사이드바 열기/닫기 함수
    isFavorite,                // 찜 여부 확인 함수 (ex. isFavorite(title))
    toggleFavorite,            // 찜 상태 토글 함수
    favoriteTrigger,           // 찜 목록 갱신 트리거용 상태
  } = useContext(FestivalContext);

  // ✅ 축제 데이터를 Map<계절, Map<자치구, 축제 배열>> 형태로 인덱싱 (성능 최적화 목적)
  const indexedFestivalMap = useMemo(() => {
    const result = new Map();

    ["봄", "여름", "가을", "겨울"].forEach(season => {
      result.set(season, new Map());
    });

    festivalData.all.forEach(f => {
      const season = f.season;
      const district = f.GUNAME;

      if (!result.get(season).has(district)) {
        result.get(season).set(district, []);
      }

      result.get(season).get(district).push(f);
    });

    return result; // 최종 결과: Map<계절, Map<자치구, 축제배열>>
  }, [festivalData]);

  // ✅ 현재 계절 및 자치구 기준으로 필터링된 축제 리스트 계산
  const filteredFestivals = useMemo(() => {
    const bySeasonMap = indexedFestivalMap.get(currentSeason);
    if (!bySeasonMap) return [];

    // 전체 보기(자치구 미선택)인 경우: 모든 자치구 축제 리스트 평탄화해서 반환
    if (selectedDistrict === '') {
      return Array.from(bySeasonMap.values()).flat(); // [[...], [...]] → [...]
    }

    // 특정 자치구만 선택된 경우: 해당 자치구의 축제 배열 반환
    return bySeasonMap.get(selectedDistrict) || [];
  }, [indexedFestivalMap, currentSeason, selectedDistrict]);

  // ✅ 지도에서 자치구를 클릭했을 때 실행되는 핸들러
  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);  // 자치구 상태 설정
    setSidebarVisible(true);        // 사이드바 열기
  };

  // ✅ 사이드바를 닫을 때 호출되는 핸들러
  const handleCloseSidebar = () => {
    setSidebarVisible(false);       // 사이드바 닫기
    setSelectedDistrict('');        // 선택된 자치구 초기화
  };

  // ✅ 외부 컴포넌트에서 필요한 상태 및 제어 함수 반환
  return {
    // 데이터
    festivalData,
    filteredFestivals,
    selectedFestival,
    currentSeason,
    selectedDistrict,
    topDistricts,
    isFavorite,
    favoriteTrigger,

    // 제어 함수
    setCurrentSeason,
    setSelectedFestival,
    setSelectedDistrict,
    setTopDistricts,
    toggleFavorite,

    // 사이드바 관련
    sidebarVisible,
    setSidebarVisible,
    handleDistrictClick,
    handleCloseSidebar,
  };
}

// ✅ 문서 제목을 설정하는 커스텀 훅 (페이지별 제목 동적 설정)
export const usePageTitle = (titleText) => {
  useEffect(() => {
    document.title = `${titleText}` || "서울 페스타";
  }, [titleText]);
};