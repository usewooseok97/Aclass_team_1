
import Footer from "../Component/Footer"
import { MainHeader } from "../Component/Header"
import SeoulMap from "../Component/SeoulMap"
import Sidebar from "../Component/SideBar"
import { Extercard } from "../Component/EXCard"
import background from "../assets/mainBackground.png"
import { useFestivalUI } from "../Hooks/FestivalHooks"

function MainPage() {

  const { selectedFestival } = useFestivalUI();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",      // 세로 배치
      justifyContent: "space-between", // 헤더-본문-푸터 간 간격 확보
      width: "100vw",
      height: "100vh",
      overflowX: "hidden",
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <MainHeader />
      {/* ✅ 지도와 사이드바를 좌우로 배치 */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", minWidth: "1490px" ,position: "relative" }}>
        {/* ✅ 지도 (구 클릭 + 계절 선택 가능) */}
        {!selectedFestival && (
          <SeoulMap/>
        )}
        {selectedFestival && (
          <Extercard/>
        )}
        {/* ✅ 사이드바: 구 클릭 시 나타나며 해당 축제 리스트 출력 */}
        <Sidebar/>
      </div>
      <Footer />
    </div>
  );
}

export default MainPage
