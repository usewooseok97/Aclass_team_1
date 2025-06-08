import { useContext, useMemo } from "react";
import { FestivalContext } from "../App";


export function useFestivalUI() {
  // 🔸 Context에서 전역 상태와 제어 함수들을 가져옴
  const {
    festivalData,              // 전체 및 계절별 축제 데이터
    setCurrentSeason,          // 현재 선택 계절 변경 함수
    currentSeason,             // 현재 선택된 계절
    selectedDistrict,          // 현재 선택된 자치구
    setSelectedDistrict,       // 자치구 선택 변경 함수
    selectedFestival,          // 상세보기용으로 선택된 축제
    setSelectedFestival,       // 축제 선택 제어 함수
    topDistricts,              // 평점 기준 상위 자치구 3개
    setTopDistricts,           // 상위 자치구 설정 함수
    sidebarVisible,            // 사이드바 표시 여부
    setSidebarVisible          // 사이드바 열기/닫기 함수
  } = useContext(FestivalContext);

  // 🔸 자치구 이름 비교 필터 조건 함수
  const districtMatch = (guname, selected) =>
    selected === '' || guname === selected;

  // 🔸 현재 계절 + 자치구 기준으로 축제 필터링
  const filteredFestivals = useMemo(() => {
    return (
      festivalData.bySeason[currentSeason]?.filter(item =>
        districtMatch(item.GUNAME, selectedDistrict)
      ) || []
    );
  }, [festivalData, currentSeason, selectedDistrict]);

  // 🔸 지도에서 자치구 클릭 시: 선택 + 사이드바 열기
  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    setSidebarVisible(true);
  };

  // 🔸 사이드바 닫을 때: 비활성화 + 자치구 해제
  const handleCloseSidebar = () => {
    setSidebarVisible(false);
    setSelectedDistrict('');
  };

  // 🔸 외부에서 사용할 상태와 함수들을 반환
  return {
    sidebarVisible,
    setSidebarVisible,
    handleDistrictClick,
    handleCloseSidebar,
    filteredFestivals,
    selectedFestival,
    setSelectedFestival,
    currentSeason,
    selectedDistrict,
    setCurrentSeason,
    topDistricts,
    setTopDistricts,
  };
}