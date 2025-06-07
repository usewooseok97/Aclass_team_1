import { FestivalContext } from "../App"
import Footer from "../Component/Footer"
import { MainHeader } from "../Component/Header"
import SeoulMap from "../Component/SeoulMap"
import Sidebar from "../Component/SideBar"
import background from "../assets/mainBackground.png"
import { useContext, useState } from "react"

function MainPage() {
  // ✅ Context에서 필요한 데이터와 상태 변경 함수 가져오기
  const {
    festivalData,           // 전체 축제 데이터 (계절별 포함)
    currentSeason,          // 현재 선택된 계절
    selectedDistrict,       // 현재 선택된 자치구
    setSelectedDistrict,    // 자치구 설정 함수
    setCurrentSeason        // 계절 설정 함수
  } = useContext(FestivalContext);

  // ✅ 사이드바 보이기 여부 관리
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // ✅ 지도에서 자치구 클릭 시: 해당 구 선택하고 사이드바 열기
  const handleDistrictClick = (district) => {
    setSelectedDistrict(district);
    setSidebarVisible(true);
  };

  // ✅ 사이드바 닫기: 자치구 해제 및 사이드바 숨기기
  const handleCloseSidebar = () => {
    setSidebarVisible(false);
    setSelectedDistrict('');
  };

  // ✅ 선택된 자치구와 축제의 GUNAME이 일치하는지 확인
  function districtMatch(guname, selected) {
    return selected === '' || guname === selected;
  }

  // ✅ 현재 계절과 자치구 기준으로 필터링된 축제 리스트
  const filteredFestivals = festivalData.bySeason[currentSeason]?.filter(item =>
    districtMatch(item.GUNAME, selectedDistrict)
  ) || [];

  return (
    <div style={{
      width: "100vw", height: "100vh", overflow: "hidden",
      backgroundImage: `url(${background})`,        // ✅ 전체 배경 이미지
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <MainHeader />

      {/* ✅ 지도와 사이드바를 좌우로 배치 */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", minWidth: "1490px" }}>
        {/* ✅ 지도 (구 클릭 + 계절 선택 가능) */}
        <SeoulMap
          onDistrictClick={handleDistrictClick}
          currentSeason={currentSeason}
          setCurrentSeason={setCurrentSeason}
        />

        {/* ✅ 사이드바: 구 클릭 시 나타나며 해당 축제 리스트 출력 */}
        <Sidebar
          visible={sidebarVisible}
          district={selectedDistrict}
          festivals={filteredFestivals}
          onClose={handleCloseSidebar}
        />
      </div>

      <Footer />
    </div>
  );
}

export default MainPage
