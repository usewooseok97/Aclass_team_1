// 지도 영역 데이터와 이미지 리소스 가져오기
import seoulMapData from '../dataset/seoulMapData';
import seoulImage from '../assets/서울지도2.png';
// 커스텀 이미지맵 컴포넌트 (외곽선 강조용 캔버스 사용)
import ImageMapper from './ImageMapper';
import { useState } from 'react';
import SeasonButton from './Seasonbutton';
import { FestivalContext } from '../App';
import { useFestivalUI } from '../Hooks/FestivalHooks';

// ✅ 서울 지도 + 계절 선택 UI를 포함한 컴포넌트

export default function SeoulMap() {
  const [hoveredId, setHoveredId] = useState(null); // 🔸 마우스 hover 중인 지역 
  // 🔸 context 기반 상태 및 함수들 가져오기
  const {
    topDistricts,          // 상위 평점 3개 자치구 이름 리스트
    currentSeason,         // 현재 선택된 계절 (봄/여름/가을/겨울)
    setCurrentSeason,      // 계절 변경 함수
    handleDistrictClick,   // 자치구 클릭 시 실행할 핸들러
  } = useFestivalUI();

  // 🔸 지도 영역 정보 구성 (hover 및 top 구 강조 반영)
  const dynamicMap = {
    ...seoulMapData,
    areas: seoulMapData.areas.map(area => {
      const isHovered = area.id === hoveredId;
      const isTop = topDistricts.includes(area.name); // 상위 구인지 확인

      return {
        ...area,
        active: isHovered,
        isTop, // 🔹 커스텀으로 활용 가능 (ex. 테두리 강조 등)
        fillColor: isHovered ? 'red' : 'rgba(255,255,255,0.001)', // hover 시 강조 색
        preFillColor: "rgba(255,255,255,0.1)", // 평소 흐린 색
      };
    }),
  };
  
  return (
    <div style={{ 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "300px",
        maxWidth: "100%",
        flex: "1 1 800px", // ✅ 반응형 flex
    }}>
      <ImageMapper
        src={seoulImage}
        map={dynamicMap}
        width={800}
        responsive
        useCanvas={true}
        onMouseEnter={area => setHoveredId(area.id)}
        onMouseLeave={() => setHoveredId(null)}
        onClick={area => handleDistrictClick(area.name)}
      />

      <div className="mt-3">
        {['봄', '여름', '가을', '겨울'].map(season => (
          <SeasonButton
            key={season}
            season={season}
            currentSeason={currentSeason}
            setCurrentSeason={setCurrentSeason}
          />
        ))}
      </div>
    </div>
  );
}