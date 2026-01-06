import { useEffect, useRef, useState } from "react";
import seoulMapSvg from "../assets/seoul-map.svg";

interface DistrictData {
  id: string; // 구 ID (예: 'guro', 'gangnam')
  name: string; // 한글 이름 (예: '구로구', '강남구')
  value: number; // 데이터 값 (축제 수 등)
  color?: string; // 선택적 색상
}

interface SeoulMapProps {
  districtData?: DistrictData[]; // 향후 데이터를 받을 수 있도록
  onDistrictClick?: (district: DistrictData) => void;
}

const SeoulMap = ({ districtData = [], onDistrictClick }: SeoulMapProps) => {
  return (
    <object
      data={seoulMapSvg}
      type="image/svg+xml"
      className="w-[50%] h-full max-w-[995px] max-h-[834px]"
      aria-label="서울시 행정구역 지도"
    >
      서울시 지도를 불러올 수 없습니다.
    </object>
  );
};

export default SeoulMap;

// 사용 예시:
//
// const App = () => {
//     const sampleData: DistrictData[] = [
//         { id: 'guro', name: '구로구', value: 100 },
//         { id: 'gangnam', name: '강남구', value: 50 },
//         { id: 'jongno', name: '종로구', value: 30 },
//     ];
//
//     const handleClick = (district: DistrictData) => {
//         console.log('클릭한 구:', district);
//     };
//
//     return (
//         <SeoulMap
//             districtData={sampleData}
//             onDistrictClick={handleClick}
//         />
//     );
// };
