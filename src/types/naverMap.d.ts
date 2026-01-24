// 네이버 지도 전역 타입 선언
declare namespace naver.maps {
  // 이벤트 리스너 참조 타입
  interface MapEventListener {
    eventName: string;
    target: unknown;
    listener: () => void;
  }

  class Map {
    constructor(element: string | HTMLElement, options?: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(level: number): void;
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    getSW(): LatLng;
    getNE(): LatLng;
    hasLatLng(latlng: LatLng): boolean;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
    setPosition(latlng: LatLng): void;
    setIcon(icon: MarkerIcon): void;
    getTitle(): string;
    setTitle(title: string): void;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, marker: Marker): void;
    close(): void;
    getMap(): Map | null;
    setContent(content: string): void;
    getContent(): string;
  }

  namespace Event {
    function addListener(
      target: unknown,
      type: string,
      handler: () => void
    ): MapEventListener;
    function removeListener(listener: MapEventListener): void;
  }

  interface MapOptions {
    center: LatLng;
    zoom: number;
    minZoom?: number;
    maxZoom?: number;
    zoomControl?: boolean;
    zoomControlOptions?: {
      position: PositionType;
    };
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    icon?: MarkerIcon;
    title?: string;
    zIndex?: number;
  }

  interface MarkerIcon {
    content: string;
    anchor?: Point;
  }

  interface InfoWindowOptions {
    content: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    anchorSize?: Size;
    anchorSkew?: boolean;
  }

  class Point {
    constructor(x: number, y: number);
  }

  class Size {
    constructor(width: number, height: number);
  }

  // Position 상수
  type PositionType = symbol;
  const Position: {
    TOP_RIGHT: PositionType;
    TOP_LEFT: PositionType;
    BOTTOM_RIGHT: PositionType;
    BOTTOM_LEFT: PositionType;
  };
}

declare global {
  interface Window {
    naver: typeof naver;
  }
}

export {};
