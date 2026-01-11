import { useEffect, useRef } from "react";
import seoulMapSvg from "../assets/seoul-map.svg";
import { useFestivalContext } from "../contexts/FestivalContext";

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
  const svgRef = useRef<HTMLObjectElement>(null);
  const { setSelectedDistrict } = useFestivalContext();

  useEffect(() => {
    const objectElement = svgRef.current;
    if (!objectElement) return;

    const handleLoad = () => {
      const svgDoc = objectElement.contentDocument;
      if (!svgDoc) {
        console.warn('SVG document not accessible');
        return;
      }

      // Find all district <g> elements (elements with both id and k_id attributes)
      const districts = svgDoc.querySelectorAll('[id][k_id]');

      districts.forEach((district) => {
        district.addEventListener('click', (e) => {
          const target = e.currentTarget as Element;
          const koreanName = target.getAttribute('k_id'); // "강남구", "종로구" etc.

          if (koreanName) {
            setSelectedDistrict(koreanName);

            // Optional: Visual feedback - add selected class
            districts.forEach(d => d.classList.remove('selected'));
            target.classList.add('selected');
          }
        });

        // Add cursor pointer on hover
        (district as HTMLElement).style.cursor = 'pointer';
      });
    };

    objectElement.addEventListener('load', handleLoad);

    // Check if already loaded
    if (objectElement.contentDocument) {
      handleLoad();
    }

    return () => {
      objectElement.removeEventListener('load', handleLoad);
    };
  }, [setSelectedDistrict]);

  return (
    <object
      ref={svgRef}
      data={seoulMapSvg}
      type="image/svg+xml"
      className="w-[60%] h-full max-w-[995px] max-h-[834px]"
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
