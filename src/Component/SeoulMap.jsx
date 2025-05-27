// 지도 영역 데이터와 이미지 리소스 가져오기
import seoulMapData from '../dataset/seoulMapData';
import seoulImage from '../assets/서울지도2.png';
// 커스텀 이미지맵 컴포넌트 (외곽선 강조용 캔버스 사용)
import ImageMapper from './ImageMapper';
import { useState } from 'react';

export default function SeoulMap() {
  // 현재 마우스가 올라간 구역의 ID 저장
  const [hoveredId, setHoveredId] = useState(null);

  // 마우스 hover 상태에 따라 동적으로 색상/상태가 적용된 map 데이터 생성
  const dynamicMap = {
    ...seoulMapData, // 기본 맵 데이터 복사
    areas: seoulMapData.areas.map(area => ({
      ...area,
      active: area.id === hoveredId,              // 현재 hover된 구역만 active
      preFillColor: 'rgba(0, 0, 255, 0)',          // 기본 배경색 없음 (투명)
      fillColor: 'rgba(255, 0, 0, 0.6)',           // hover 시 빨간 외곽선 강조
    })),
  };

  return (
    <ImageMapper
      src={seoulImage}           // 배경 이미지 (서울 지도)
      map={dynamicMap}           // hover 상태 반영된 map 데이터
      width={900}                // 고정 너비
      responsive                 // 반응형 비율 유지
      useCanvas={true}           // canvas 모드 활성화 (외곽선 강조 가능)
      // 마우스가 영역 위에 올라가면 해당 ID 저장
      onMouseEnter={area => setHoveredId(area.id)}
      
      // 마우스가 영역에서 빠지면 hover 해제
      onMouseLeave={() => setHoveredId(null)}
      // 구역 클릭 시 구 이름 alert 표시
      onClick={area => alert(area.name)}
    />
  );
}
