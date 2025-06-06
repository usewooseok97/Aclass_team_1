// 지도 영역 데이터와 이미지 리소스 가져오기
import seoulMapData from '../dataset/seoulMapData';
import seoulImage from '../assets/서울지도2.png';
// 커스텀 이미지맵 컴포넌트 (외곽선 강조용 캔버스 사용)
import ImageMapper from './ImageMapper';
import { useState } from 'react';
import SeasonButton from './Seasonbutton';

// ✅ 서울 지도 + 계절 선택 UI를 포함한 컴포넌트
export default function SeoulMap({ onDistrictClick, currentSeason, setCurrentSeason }) {
  const [hoveredId, setHoveredId] = useState(null);     // ✅ 마우스가 올라간 구역 ID 저장

  // ✅ hover 상태에 따라 동적으로 스타일 적용된 지도 데이터 구성
  const dynamicMap = {
    ...seoulMapData, // 기본 구역 데이터 복사
    areas: seoulMapData.areas.map(area => ({
      ...area,
      active: area.id === hoveredId,                  // 현재 hover된 구역만 강조
      preFillColor: 'rgba(0, 0, 255, 0)',              // 기본 배경색 없음
      fillColor: 'rgba(255, 0, 0, 0.6)',               // hover 시 강조 색상
    })),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      
      {/* ✅ 서울 지도: 각 구역을 hover/클릭 가능 */}
      <ImageMapper
        src={seoulImage}                  // 배경 이미지
        map={dynamicMap}                 // hover 상태 반영된 영역 정보
        width={900}                      // 고정 너비
        responsive                       // 반응형 유지
        useCanvas={true}                 // canvas 사용 (외곽선 강조)
        onMouseEnter={area => setHoveredId(area.id)}       // hover 시작 시 ID 저장
        onMouseLeave={() => setHoveredId(null)}            // hover 해제 시 초기화
        onClick={area => {
          if (onDistrictClick) {
            onDistrictClick(area.name);  // 클릭된 구 이름을 상위로 전달
          }
        }}
      />

      {/* ✅ 계절 선택 버튼: 현재 계절은 강조 표시 */}
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