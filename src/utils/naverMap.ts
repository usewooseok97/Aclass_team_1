import type { Festival, Place } from "@/types/festival";

/**
 * HTML 특수문자 이스케이프 (XSS 방지)
 */
export function escapeHtml(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * 네이버 좌표(mapx/mapy)를 LatLng 객체로 변환
 * 네이버 좌표 형식: WGS84 × 10^7
 */
export function toLatLng(
  mapx: string,
  mapy: string
): naver.maps.LatLng | null {
  if (!mapx || !mapy || !window.naver?.maps) return null;

  try {
    const lat = parseInt(mapy) / 10000000;
    const lng = parseInt(mapx) / 10000000;

    if (isNaN(lat) || isNaN(lng)) return null;

    return new naver.maps.LatLng(lat, lng);
  } catch {
    return null;
  }
}

/**
 * 축제 마커 아이콘 (보라색)
 */
export function createFestivalMarkerIcon(): naver.maps.MarkerIcon {
  return {
    content: `
      <div style="
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 3px 8px rgba(99, 102, 241, 0.4);
        border: 2px solid white;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
          <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z"/>
        </svg>
      </div>
    `,
    anchor: new naver.maps.Point(18, 36),
  };
}

/**
 * 맛집 마커 아이콘 (주황색)
 */
export function createPlaceMarkerIcon(): naver.maps.MarkerIcon {
  return {
    content: `
      <div style="
        width: 28px;
        height: 28px;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(249, 115, 22, 0.4);
        border: 2px solid white;
      ">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
        </svg>
      </div>
    `,
    anchor: new naver.maps.Point(14, 14),
  };
}

/**
 * 축제 InfoWindow HTML 콘텐츠
 */
export function createFestivalInfoContent(festival: Festival): string {
  const isFree = festival.IS_FREE === "무료";
  const title = escapeHtml(festival.TITLE);
  const place = escapeHtml(festival.PLACE);
  const date = escapeHtml(festival.DATE);
  const freeText = escapeHtml(festival.IS_FREE);

  return `
    <div style="
      padding: 12px;
      max-width: 260px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      ${
        festival.MAIN_IMG
          ? `<img
          src="${escapeHtml(festival.MAIN_IMG)}"
          alt="${title}"
          style="
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 10px;
          "
          onerror="this.style.display='none'"
        />`
          : ""
      }
      <h4 style="
        margin: 0 0 6px;
        font-weight: 600;
        font-size: 14px;
        color: #1f2937;
        line-height: 1.3;
      ">${title}</h4>
      <p style="
        margin: 0 0 4px;
        font-size: 12px;
        color: #6b7280;
      ">${place}</p>
      <p style="
        margin: 0 0 8px;
        font-size: 11px;
        color: #9ca3af;
      ">${date}</p>
      <span style="
        display: inline-block;
        padding: 2px 8px;
        font-size: 11px;
        font-weight: 500;
        border-radius: 4px;
        background: ${isFree ? "#dcfce7" : "#fef3c7"};
        color: ${isFree ? "#166534" : "#92400e"};
      ">${freeText}</span>
    </div>
  `;
}

/**
 * 맛집 InfoWindow HTML 콘텐츠
 */
export function createPlaceInfoContent(place: Place): string {
  const name = escapeHtml(place.name);
  const category = escapeHtml(place.category);
  const address = escapeHtml(place.roadAddress || place.address);
  const telephone = escapeHtml(place.telephone);

  return `
    <div style="
      padding: 12px;
      max-width: 220px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <h4 style="
        margin: 0 0 4px;
        font-weight: 600;
        font-size: 14px;
        color: #1f2937;
      ">${name}</h4>
      <p style="
        margin: 0 0 4px;
        font-size: 12px;
        color: #f97316;
        font-weight: 500;
      ">${category}</p>
      <p style="
        margin: 0;
        font-size: 11px;
        color: #6b7280;
        line-height: 1.4;
      ">${address}</p>
      ${
        telephone
          ? `<p style="
          margin: 6px 0 0;
          font-size: 11px;
          color: #3b82f6;
        ">${telephone}</p>`
          : ""
      }
    </div>
  `;
}

/**
 * 네이버 지도 검색 URL 생성
 * @param place 장소명
 * @param guName 구 이름 (선택)
 * @param mapx 경도 (선택)
 * @param mapy 위도 (선택)
 */
export function getNaverMapSearchUrl(
  place: string,
  guName?: string,
  mapx?: string,
  mapy?: string
): string {
  const query = guName ? `서울 ${guName} ${place}` : place;
  const encodedQuery = encodeURIComponent(query);

  // 좌표가 있으면 좌표 기반 URL
  if (mapx && mapy) {
    const lat = parseInt(mapy) / 10000000;
    const lng = parseInt(mapx) / 10000000;
    return `https://map.naver.com/v5/search/${encodedQuery}?c=${lng},${lat},15,0,0,0,dh`;
  }

  // 좌표가 없으면 검색 URL
  return `https://map.naver.com/v5/search/${encodedQuery}`;
}

/**
 * 네이버 지도 길찾기 URL 생성
 * @param startName 출발지 이름
 * @param startMapx 출발지 경도
 * @param startMapy 출발지 위도
 * @param endName 도착지 이름
 * @param endMapx 도착지 경도
 * @param endMapy 도착지 위도
 */
export function getNaverMapDirectionsUrl(
  startName: string,
  startMapx: string,
  startMapy: string,
  endName: string,
  endMapx: string,
  endMapy: string
): string {
  const slng = parseInt(startMapx) / 10000000;
  const slat = parseInt(startMapy) / 10000000;
  const dlng = parseInt(endMapx) / 10000000;
  const dlat = parseInt(endMapy) / 10000000;

  const encodedStart = encodeURIComponent(startName);
  const encodedEnd = encodeURIComponent(endName);

  return `https://map.naver.com/v5/directions/${slng},${slat},${encodedStart}/${dlng},${dlat},${encodedEnd}/-/transit`;
}

/**
 * 네이버 지도 스크립트 동적 로드
 */
export function loadNaverMapScript(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우
    if (window.naver?.maps) {
      resolve();
      return;
    }

    // 이미 스크립트가 추가된 경우
    const existingScript = document.querySelector(
      'script[src*="oapi.map.naver.com"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    script.onload = () => {
      // 스크립트 로드 후 약간의 대기
      setTimeout(() => {
        if (window.naver?.maps) {
          resolve();
        } else {
          reject(new Error("네이버 지도 API 초기화 실패"));
        }
      }, 100);
    };

    script.onerror = () => {
      reject(new Error("네이버 지도 스크립트 로드 실패"));
    };

    document.head.appendChild(script);
  });
}
