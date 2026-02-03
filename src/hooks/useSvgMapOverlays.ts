import { useCallback, useMemo, type RefObject } from 'react';
import type { Festival } from '@/types/festival';
import type { TooltipState } from '@/components/MapTooltip';
import {
  addBadgeToSvg,
  addMarkerToSvg,
  clearOverlays,
  getBadgeColor,
  getSvgMapStyles,
} from '@/utils/svgMapUtils';
import seoulMapData, { getDistrictCenter } from '@/constants/guData';

export interface DistrictFestivalData {
  name: string;
  count: number;
  topFestival: Festival | null;
  center: { x: number; y: number };
}

interface UseSvgMapOverlaysOptions {
  allFestivals: Festival[];
  selectedSeason: string;
  svgRef: RefObject<HTMLObjectElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  setSelectedDistrict: (district: string) => void;
  navigateToDetail: (festival: Festival) => void;
  setTooltip: (tooltip: TooltipState | null) => void;
}

export const useSvgMapOverlays = ({
  allFestivals,
  selectedSeason,
  svgRef,
  containerRef,
  setSelectedDistrict,
  navigateToDetail,
  setTooltip,
}: UseSvgMapOverlaysOptions) => {
  // 구별 축제 데이터 계산
  const districtData = useMemo((): DistrictFestivalData[] => {
    const dataMap: { [key: string]: { count: number; festivals: Festival[] } } = {};

    seoulMapData.areas.forEach((area) => {
      dataMap[area.name] = { count: 0, festivals: [] };
    });

    const festivalsToShow =
      selectedSeason === '전체'
        ? allFestivals
        : allFestivals.filter((f) => f.season === selectedSeason);

    festivalsToShow.forEach((festival) => {
      if (dataMap[festival.GUNAME]) {
        dataMap[festival.GUNAME].count++;
        dataMap[festival.GUNAME].festivals.push(festival);
      }
    });

    return seoulMapData.areas.map((area) => {
      const center = getDistrictCenter(area.name);
      const festivals = dataMap[area.name]?.festivals || [];

      const topFestival =
        festivals.length > 0
          ? festivals.reduce(
              (top, current) =>
                current.buzz_score > (top?.buzz_score || 0) ? current : top,
              festivals[0]
            )
          : null;

      return {
        name: area.name,
        count: dataMap[area.name]?.count || 0,
        topFestival,
        center: center || { x: 0, y: 0 },
      };
    });
  }, [allFestivals, selectedSeason]);

  // 마커 호버 핸들러
  const handleMarkerMouseEnter = useCallback(
    (festival: Festival, markerG: SVGGElement, x: number, y: number) => {
      markerG.style.transform = `translate(${x}px, ${y + 15}px) scale(1.15)`;
      markerG.style.transition = 'transform 0.2s ease';

      const container = containerRef.current;
      const svgElement = svgRef.current;
      if (container && svgElement) {
        const containerRect = container.getBoundingClientRect();
        const svgRect = svgElement.getBoundingClientRect();

        const scaleX = svgRect.width / 995;
        const scaleY = svgRect.height / 834;

        const screenX = svgRect.left - containerRect.left + x * scaleX;
        const screenY = svgRect.top - containerRect.top + (y - 30) * scaleY;

        setTooltip({ festival, x: screenX, y: screenY });
      }
    },
    [containerRef, svgRef, setTooltip]
  );

  const handleMarkerMouseLeave = useCallback(
    (markerG: SVGGElement, x: number, y: number) => {
      markerG.style.transform = `translate(${x}px, ${y + 15}px) scale(1)`;
      setTooltip(null);
    },
    [setTooltip]
  );

  const handleMarkerClick = useCallback(
    (festival: Festival) => {
      setTooltip(null);
      navigateToDetail(festival);
    },
    [navigateToDetail, setTooltip]
  );

  // SVG 초기화 및 오버레이 추가
  const initializeSvg = useCallback(
    (svgDoc: Document) => {
      // 스타일 적용
      const styleElement = svgDoc.querySelector('style');
      if (styleElement) {
        styleElement.textContent = getSvgMapStyles();
      }

      // 구 클릭 이벤트 설정
      const districts = svgDoc.querySelectorAll('[k_id]');
      districts.forEach((district) => {
        const koreanName = district.getAttribute('k_id');
        if (!koreanName || koreanName === '한강') return;

        district.addEventListener('click', () => {
          if (koreanName) {
            setSelectedDistrict(koreanName);
            districts.forEach((d) => d.classList.remove('selected'));
            district.classList.add('selected');
          }
        });
      });

      // 오버레이 제거 및 추가
      clearOverlays(svgDoc);

      districtData.forEach((district) => {
        if (district.count > 0) {
          addBadgeToSvg({
            svgDoc,
            x: district.center.x,
            y: district.center.y,
            count: district.count,
            color: getBadgeColor(district.count),
            districtName: district.name,
            onClick: setSelectedDistrict,
          });

          if (district.topFestival) {
            addMarkerToSvg({
              svgDoc,
              x: district.center.x,
              y: district.center.y,
              festival: district.topFestival,
              onMarkerClick: handleMarkerClick,
              onMouseEnter: handleMarkerMouseEnter,
              onMouseLeave: handleMarkerMouseLeave,
            });
          }
        }
      });
    },
    [
      districtData,
      setSelectedDistrict,
      handleMarkerClick,
      handleMarkerMouseEnter,
      handleMarkerMouseLeave,
    ]
  );

  return { districtData, initializeSvg };
};
