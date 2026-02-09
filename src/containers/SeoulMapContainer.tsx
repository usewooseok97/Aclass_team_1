import { useEffect, useRef, useState, memo } from 'react';
import seoulMapSvg from '../assets/seoul-map.svg';
import { useFestivalContext } from '../hooks/useFestivalContext';
import { useSvgMapOverlays } from '../hooks/useSvgMapOverlays';
import { MapTooltip, type TooltipState } from '../components/MapTooltip';

const SeoulMapContainer = memo(() => {
  const svgRef = useRef<HTMLObjectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    allFestivals,
    selectedSeason,
    setSelectedDistrict,
    navigateToDetail,
  } = useFestivalContext();

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const { initializeSvg } = useSvgMapOverlays({
    allFestivals,
    selectedSeason,
    svgRef,
    containerRef,
    setSelectedDistrict,
    navigateToDetail,
    setTooltip,
  });

  useEffect(() => {
    const objectElement = svgRef.current;
    if (!objectElement) return;

    const handleLoad = () => {
      const svgDoc = objectElement.contentDocument;
      if (!svgDoc) {
        console.warn('SVG document not accessible');
        return;
      }
      initializeSvg(svgDoc);
    };

    objectElement.addEventListener('load', handleLoad);

    if (objectElement.contentDocument) {
      handleLoad();
    }

    return () => {
      objectElement.removeEventListener('load', handleLoad);
    };
  }, [initializeSvg]);

  return (
    <div
      ref={containerRef}
      className="relative w-full md:w-[60%] max-w-none md:max-w-[995px] max-h-[60vh] md:max-h-[834px]"
    >
      <object
        ref={svgRef}
        data={seoulMapSvg}
        type="image/svg+xml"
        className="w-full h-full"
        aria-label="서울시 행정구역 지도"
      >
        서울시 지도를 불러올 수 없습니다.
      </object>

      {tooltip && <MapTooltip tooltip={tooltip} />}
    </div>
  );
});

SeoulMapContainer.displayName = 'SeoulMapContainer';

export { SeoulMapContainer };
