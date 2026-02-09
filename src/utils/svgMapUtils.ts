import type { Festival } from '../types/festival';

const SVG_NS = 'http://www.w3.org/2000/svg';

export const getBadgeColor = (count: number): string => {
  if (count <= 2) return '#22c55e'; // 초록
  if (count <= 4) return '#eab308'; // 노랑
  if (count <= 6) return '#f97316'; // 주황
  return '#ef4444'; // 빨강
};

export const clearOverlays = (svgDoc: Document): void => {
  const badges = svgDoc.querySelectorAll('.festival-badge');
  const markers = svgDoc.querySelectorAll('.festival-marker');
  badges.forEach((badge) => badge.remove());
  markers.forEach((marker) => marker.remove());
};

interface AddBadgeOptions {
  svgDoc: Document;
  x: number;
  y: number;
  count: number;
  color: string;
  districtName: string;
  onClick: (districtName: string) => void;
}

export const addBadgeToSvg = ({
  svgDoc,
  x,
  y,
  count,
  color,
  districtName,
  onClick,
}: AddBadgeOptions): void => {
  const seoulMap = svgDoc.querySelector('#seoul-map');
  if (!seoulMap) return;

  const g = svgDoc.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'festival-badge');
  g.setAttribute('data-district', districtName);
  g.style.cursor = 'pointer';

  // 배지 배경 원 (마커 핀 오른쪽 상단에 배치)
  const circle = svgDoc.createElementNS(SVG_NS, 'circle');
  circle.setAttribute('cx', String(x + 14));
  circle.setAttribute('cy', String(y - 32));
  circle.setAttribute('r', '14');
  circle.setAttribute('fill', color);
  circle.setAttribute('stroke', 'white');
  circle.setAttribute('stroke-width', '2');
  circle.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';

  // 배지 숫자
  const text = svgDoc.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', String(x + 14));
  text.setAttribute('y', String(y - 32));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'central');
  text.setAttribute('fill', 'white');
  text.setAttribute('font-size', '12');
  text.setAttribute('font-weight', 'bold');

  text.textContent = String(count);

  g.appendChild(circle);
  g.appendChild(text);

  g.addEventListener('click', (e) => {
    e.stopPropagation();
    onClick(districtName);
  });

  seoulMap.appendChild(g);
};

interface AddMarkerOptions {
  svgDoc: Document;
  x: number;
  y: number;
  festival: Festival;
  onMarkerClick: (festival: Festival) => void;
  onMouseEnter: (festival: Festival, markerG: SVGGElement, x: number, y: number) => void;
  onMouseLeave: (markerG: SVGGElement, x: number, y: number) => void;
}

export const addMarkerToSvg = ({
  svgDoc,
  x,
  y,
  festival,
  onMarkerClick,
  onMouseEnter,
  onMouseLeave,
}: AddMarkerOptions): void => {
  const seoulMap = svgDoc.querySelector('#seoul-map');
  if (!seoulMap) return;

  const g = svgDoc.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', 'festival-marker');
  g.setAttribute('data-festival', festival.TITLE);
  g.style.cursor = 'pointer';

  // 마커 그룹 (핀 팁이 구 중심에 위치하도록)
  const markerG = svgDoc.createElementNS(SVG_NS, 'g');
  markerG.setAttribute('transform', `translate(${x}, ${y})`);

  // 핀 모양 배경
  const pin = svgDoc.createElementNS(SVG_NS, 'path');
  pin.setAttribute(
    'd',
    'M0,-30 C-10,-30 -15,-22 -15,-15 C-15,-5 0,0 0,0 C0,0 15,-5 15,-15 C15,-22 10,-30 0,-30 Z'
  );
  pin.setAttribute('fill', '#6366f1');
  pin.setAttribute('stroke', 'white');
  pin.setAttribute('stroke-width', '2');
  pin.style.filter = 'drop-shadow(0 3px 6px rgba(99, 102, 241, 0.4))';

  // 별 아이콘
  const star = svgDoc.createElementNS(SVG_NS, 'path');
  star.setAttribute(
    'd',
    'M0,-22 L1.5,-17 L6.5,-17 L2.5,-14 L4,-9 L0,-12 L-4,-9 L-2.5,-14 L-6.5,-17 L-1.5,-17 Z'
  );
  star.setAttribute('fill', 'white');

  markerG.appendChild(pin);
  markerG.appendChild(star);
  g.appendChild(markerG);

  g.addEventListener('click', (e) => {
    e.stopPropagation();
    onMarkerClick(festival);
  });

  g.addEventListener('mouseenter', () => {
    onMouseEnter(festival, markerG as unknown as SVGGElement, x, y);
  });

  g.addEventListener('mouseleave', () => {
    onMouseLeave(markerG as unknown as SVGGElement, x, y);
  });

  seoulMap.appendChild(g);
};
export const getSvgMapStyles = (): string => `


  [k_id]:not(#hangang):not([k_id="한강"]) {
    cursor: pointer;
    transition: transform 0.2s ease, filter 0.2s ease;
    transform-origin: center;
    transform-box: fill-box;
  }

  /* Hover effect exclusions */
  [k_id]:not(#hangang):not([k_id="한강"]):hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(100, 100, 100, 0.5));
  }

  /* Selected state exclusions */
  [k_id]:not(#hangang):not([k_id="한강"]).selected {
    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.8));
  }

  .festival-badge {
    pointer-events: auto;
  }

  .festival-marker {
    pointer-events: auto;
  }
`;