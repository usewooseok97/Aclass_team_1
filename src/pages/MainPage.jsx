
import Footer from "../Component/Footer"
import { MainHeader } from "../Component/Header"
import SeoulMap from "../Component/SeoulMap"
import Sidebar from "../Component/SideBar"
import { Extercard } from "../Component/EXCard"
import background from "../assets/mainBackground.png"
import { useFestivalUI, usePageTitle } from "../Hooks/FestivalHooks"

function MainPage() {

  const { selectedFestival } = useFestivalUI();
  usePageTitle("서울 페스타");

  return (
    <div style={{
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh", // ✅ 최소 높이 확보
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    }}>
      <MainHeader />
      {/* 지도와 사이드바를 좌우로 배치 */}
      <div style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap", // ✅ 줄바꿈 허용
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "20px",
            gap: "20px",
          }}>
        {/* 지도 (구 클릭 + 계절 선택 가능) */}
        {!selectedFestival && (
          <SeoulMap/>
        )}
        {selectedFestival && (
          <Extercard/>
        )}
        {/* 사이드바: 구 클릭 시 나타나며 해당 축제 리스트 출력 */}
        <Sidebar/>
      </div>
      <Footer />
    </div>
  );
}

export default MainPage
