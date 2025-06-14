
import Footer from "../Component/Footer"
import { MainHeader } from "../Component/Header"
import SeoulMap from "../Component/SeoulMap"
import Sidebar from "../Component/SideBar"
import { Extercard } from "../Component/EXCard"
import background from "../assets/mainBackground.png"
import { useFestivalUI, usePageTitle } from "../Hooks/FestivalHooks"
import { getSeasonColor } from "../utilFunction/festivalUtils"
import { useEffect, useRef } from "react"
import "../styles/changeSeason.css"

function MainPage() {
  const { selectedFestival, currentSeason } = useFestivalUI();
  usePageTitle("서울 페스타");

  const overlayColor = getSeasonColor(currentSeason);
  const containerRef = useRef();
  const lastSeasonRef = useRef(null); // 🔸 마지막 실행된 계절 기억용

  const seasonImageMap = {
    봄: "/springs.png",
    여름: "/summers.png",
    가을: "/falls.png",
    겨울: "/winters.png",
  };
  // 애니메이션 발동 함수
  const triggerSeasonEffect = (season) => {
    const container = containerRef.current;
    if (!container || !season) return;

    // 기존 falling-item 제거
    const oldItems = container.querySelectorAll(".falling-item");
    oldItems.forEach((el) => el.remove());

    const FALL_COUNT = 15; // ✅ 떨어질 이미지 개수
    const duration = 2500;

    for (let i = 0; i < FALL_COUNT; i++) {
      const img = document.createElement("img");
      img.src = seasonImageMap[season] || "";
      img.className = "falling-item";

      // ✅ 랜덤 위치 및 크기 설정
      const size = 24 + Math.random() * 24; // 24~48px
      img.style.width = `${size}px`;
      img.style.height = `${size}px`;
      img.style.left = `${Math.random() * 100}vw`;
      img.style.top = `${-Math.random() * 200}px`;

      // ✅ 랜덤 회전 각도
      img.style.transform = `rotate(${Math.random() * 360}deg)`;

      container.appendChild(img);

      setTimeout(() => {
        img.remove();
      }, duration);
    }
  };

  useEffect(() => {
  if (!currentSeason) return;

  // 같은 계절이면 무시
  if (lastSeasonRef.current === currentSeason) return;

  lastSeasonRef.current = currentSeason;
  triggerSeasonEffect(currentSeason);
}, [currentSeason]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 계절 색상 오버레이 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: overlayColor,
          opacity: 0.3,
          zIndex: 0,
          pointerEvents: "none",
          transition: "background-color 0.5s ease, opacity 0.5s ease",
        }}
      />

      {/* 콘텐츠 */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <MainHeader />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "20px",
            gap: "20px",
          }}
        >
          {!selectedFestival ? (
            <SeoulMap />
          ) : (
            <Extercard />
          )}
          <Sidebar />
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;