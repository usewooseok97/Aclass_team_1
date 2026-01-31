import { useEffect, useRef, useMemo, useCallback, useState } from "react";
import seoulMapSvg from "../assets/seoul-map.svg";
import { useFestivalContext } from "../hooks/useFestivalContext";
import seoulMapData, { getDistrictCenter } from "../constants/guData";
import type { Festival } from "../types/festival";

// 축제 개수에 따른 배지 색상
const getBadgeColor = (count: number): string => {
  if (count <= 2) return "#22c55e"; // 초록
  if (count <= 4) return "#eab308"; // 노랑
  if (count <= 6) return "#f97316"; // 주황
  return "#ef4444"; // 빨강
};

// 구별 축제 데이터 계산
interface DistrictFestivalData {
  name: string;
  count: number;
  topFestival: Festival | null;
  center: { x: number; y: number };
}

// 툴팁 상태 인터페이스
interface TooltipState {
  festival: Festival;
  x: number;
  y: number;
}

const SeoulMapContainer = () => {
  const svgRef = useRef<HTMLObjectElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { allFestivals, selectedSeason, setSelectedDistrict, navigateToDetail } = useFestivalContext();

  // 툴팁 상태
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  // 구별 축제 데이터 계산
  const districtData = useMemo((): DistrictFestivalData[] => {
    const dataMap: { [key: string]: { count: number; festivals: Festival[] } } = {};

    // 초기화
    seoulMapData.areas.forEach((area) => {
      dataMap[area.name] = { count: 0, festivals: [] };
    });

    // 축제 데이터 집계 (계절 필터 적용)
    const festivalsToShow = selectedSeason === "전체"
      ? allFestivals
      : allFestivals.filter(f => f.season === selectedSeason);

    festivalsToShow.forEach((festival) => {
      if (dataMap[festival.GUNAME]) {
        dataMap[festival.GUNAME].count++;
        dataMap[festival.GUNAME].festivals.push(festival);
      }
    });

    // 결과 배열 생성
    return seoulMapData.areas.map((area) => {
      const center = getDistrictCenter(area.name);
      const festivals = dataMap[area.name]?.festivals || [];

      // buzz_score가 가장 높은 축제 찾기
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

  // SVG에 배지 추가
  const addBadgeToSvg = useCallback(
    (
      svgDoc: Document,
      x: number,
      y: number,
      count: number,
      color: string,
      districtName: string
    ) => {
      const ns = "http://www.w3.org/2000/svg";
      const seoulMap = svgDoc.querySelector("#seoul-map");
      if (!seoulMap) return;

      const g = svgDoc.createElementNS(ns, "g");
      g.setAttribute("class", "festival-badge");
      g.setAttribute("data-district", districtName);
      g.style.cursor = "pointer";

      // 배지 배경 원
      const circle = svgDoc.createElementNS(ns, "circle");
      circle.setAttribute("cx", String(x + 30));
      circle.setAttribute("cy", String(y - 30));
      circle.setAttribute("r", "14");
      circle.setAttribute("fill", color);
      circle.setAttribute("stroke", "white");
      circle.setAttribute("stroke-width", "2");
      circle.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.3))";

      // 배지 숫자
      const text = svgDoc.createElementNS(ns, "text");
      text.setAttribute("x", String(x + 30));
      text.setAttribute("y", String(y - 30));
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.setAttribute("fill", "white");
      text.setAttribute("font-size", "12");
      text.setAttribute("font-weight", "bold");
      text.setAttribute("font-family", "Arial, sans-serif");
      text.textContent = String(count);

      g.appendChild(circle);
      g.appendChild(text);

      // 배지 클릭 시 해당 구 선택
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        setSelectedDistrict(districtName);
      });

      seoulMap.appendChild(g);
    },
    [setSelectedDistrict]
  );

  // SVG에 인기 축제 마커 추가 (네이버 지도 스타일)
  const addMarkerToSvg = useCallback(
    (svgDoc: Document, x: number, y: number, festival: Festival) => {
      const ns = "http://www.w3.org/2000/svg";
      const seoulMap = svgDoc.querySelector("#seoul-map");
      if (!seoulMap) return;

      const g = svgDoc.createElementNS(ns, "g");
      g.setAttribute("class", "festival-marker");
      g.setAttribute("data-festival", festival.TITLE);
      g.style.cursor = "pointer";

      // 마커 그룹 (보라색 별 모양 - 네이버 지도 스타일)
      const markerG = svgDoc.createElementNS(ns, "g");
      markerG.setAttribute("transform", `translate(${x}, ${y + 15})`);

      // 핀 모양 배경 (보라색 그래디언트 효과)
      const pin = svgDoc.createElementNS(ns, "path");
      pin.setAttribute(
        "d",
        "M0,-30 C-10,-30 -15,-22 -15,-15 C-15,-5 0,0 0,0 C0,0 15,-5 15,-15 C15,-22 10,-30 0,-30 Z"
      );
      pin.setAttribute("fill", "#6366f1");
      pin.setAttribute("stroke", "white");
      pin.setAttribute("stroke-width", "2");
      pin.style.filter = "drop-shadow(0 3px 6px rgba(99, 102, 241, 0.4))";

      // 별 아이콘
      const star = svgDoc.createElementNS(ns, "path");
      star.setAttribute(
        "d",
        "M0,-22 L1.5,-17 L6.5,-17 L2.5,-14 L4,-9 L0,-12 L-4,-9 L-2.5,-14 L-6.5,-17 L-1.5,-17 Z"
      );
      star.setAttribute("fill", "white");

      markerG.appendChild(pin);
      markerG.appendChild(star);
      g.appendChild(markerG);

      // 마커 클릭 시 축제 상세로 이동
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        setTooltip(null); // 툴팁 닫기
        navigateToDetail(festival);
      });

      // 호버 시 툴팁 표시
      g.addEventListener("mouseenter", () => {
        markerG.style.transform = `translate(${x}px, ${y + 15}px) scale(1.15)`;
        markerG.style.transition = "transform 0.2s ease";

        // 컨테이너 기준 위치 계산
        const container = containerRef.current;
        const svgElement = svgRef.current;
        if (container && svgElement) {
          const containerRect = container.getBoundingClientRect();
          const svgRect = svgElement.getBoundingClientRect();

          // SVG 좌표를 화면 좌표로 변환
          const scaleX = svgRect.width / 995;
          const scaleY = svgRect.height / 834;

          const screenX = svgRect.left - containerRect.left + x * scaleX;
          const screenY = svgRect.top - containerRect.top + (y - 30) * scaleY;

          setTooltip({
            festival,
            x: screenX,
            y: screenY,
          });
        }
      });

      g.addEventListener("mouseleave", () => {
        markerG.style.transform = `translate(${x}px, ${y + 15}px) scale(1)`;
        setTooltip(null);
      });

      seoulMap.appendChild(g);
    },
    [navigateToDetail]
  );

  // 기존 배지/마커 제거
  const clearOverlays = useCallback((svgDoc: Document) => {
    const badges = svgDoc.querySelectorAll(".festival-badge");
    const markers = svgDoc.querySelectorAll(".festival-marker");
    badges.forEach((badge) => badge.remove());
    markers.forEach((marker) => marker.remove());
  }, []);

  // SVG 이벤트 핸들링 및 오버레이 추가
  useEffect(() => {
    const objectElement = svgRef.current;
    if (!objectElement) return;

    const handleLoad = () => {
      const svgDoc = objectElement.contentDocument;
      if (!svgDoc) {
        console.warn("SVG document not accessible");
        return;
      }

      // 기존 호버 스타일 제거 및 새로운 스타일 추가
      const styleElement = svgDoc.querySelector("style");
      if (styleElement) {
        const newStyle = `
          #seoul-map {
            filter: drop-shadow(0 0 5px black);
          }

          [k_id] {
            cursor: pointer;
            transition: transform 0.2s ease, filter 0.2s ease;
            transform-origin: center;
            transform-box: fill-box;
          }

          [k_id]:hover {
            transform: scale(1.1);
            filter: drop-shadow(0 0 8px rgba(100, 100, 100, 0.5));
          }

          [k_id].selected {
            filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
          }

          .festival-badge {
            pointer-events: auto;
          }

          .festival-marker {
            pointer-events: auto;
          }
        `;
        styleElement.textContent = newStyle;
      }

      // 구 요소에 이벤트 리스너 추가
      const districts = svgDoc.querySelectorAll("[k_id]");
      districts.forEach((district) => {
        const koreanName = district.getAttribute("k_id");
        if (!koreanName || koreanName === "한강") return;

        district.addEventListener("click", () => {
          if (koreanName) {
            setSelectedDistrict(koreanName);
            districts.forEach((d) => d.classList.remove("selected"));
            district.classList.add("selected");
          }
        });
      });

      // 기존 오버레이 제거
      clearOverlays(svgDoc);

      // 배지 및 마커 추가
      districtData.forEach((district) => {
        if (district.count > 0) {
          // 숫자 배지 추가
          addBadgeToSvg(
            svgDoc,
            district.center.x,
            district.center.y,
            district.count,
            getBadgeColor(district.count),
            district.name
          );

          // 인기 축제 마커 추가 (topFestival이 있는 경우)
          if (district.topFestival) {
            addMarkerToSvg(
              svgDoc,
              district.center.x,
              district.center.y,
              district.topFestival
            );
          }
        }
      });
    };

    objectElement.addEventListener("load", handleLoad);

    // 이미 로드된 경우
    if (objectElement.contentDocument) {
      handleLoad();
    }

    return () => {
      objectElement.removeEventListener("load", handleLoad);
    };
  }, [setSelectedDistrict, districtData, addBadgeToSvg, addMarkerToSvg, clearOverlays]);

  return (
    <div ref={containerRef} className="relative w-full md:w-[60%] h-full max-w-[995px] max-h-[834px]">
      {/* SVG 지도 */}
      <object
        ref={svgRef}
        data={seoulMapSvg}
        type="image/svg+xml"
        className="w-full h-full"
        aria-label="서울시 행정구역 지도"
      >
        서울시 지도를 불러올 수 없습니다.
      </object>

      {/* 축제 정보 툴팁 */}
      {tooltip && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-w-[260px]">
            {/* 축제 이미지 */}
            {tooltip.festival.MAIN_IMG && (
              <img
                src={tooltip.festival.MAIN_IMG}
                alt={tooltip.festival.TITLE}
                className="w-full h-[100px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}

            {/* 축제 정보 */}
            <div className="p-3">
              <h4 className="font-semibold text-sm text-gray-800 leading-tight mb-1 line-clamp-2">
                {tooltip.festival.TITLE}
              </h4>
              <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                {tooltip.festival.PLACE}
              </p>
              <p className="text-xs text-gray-400 mb-2">
                {tooltip.festival.DATE}
              </p>
              <span
                className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
                  tooltip.festival.IS_FREE === "무료"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {tooltip.festival.IS_FREE}
              </span>
            </div>
          </div>

          {/* 툴팁 화살표 */}
          <div className="flex justify-center">
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export { SeoulMapContainer };
