import { useEffect, useRef, useState, useCallback } from "react";
import type { Festival, Place } from "@/types/festival";
import {
  toLatLng,
  createFestivalMarkerIcon,
  createPlaceMarkerIcon,
  createFestivalInfoContent,
  createPlaceInfoContent,
  loadNaverMapScript,
} from "@/utils/naverMap";

interface UseNaverMapOptions {
  festival: Festival | null;
  places: Place[];
}

interface UseNaverMapReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
}

export function useNaverMap({
  festival,
  places,
}: UseNaverMapOptions): UseNaverMapReturn {
  // clientId 검증을 hook 최상단에서 처리 (effect 외부)
  const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
  const isValidClientId = !!(
    clientId && clientId !== "여기에_NCP_클라이언트_ID_입력"
  );

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const listenersRef = useRef<naver.maps.MapEventListener[]>([]);
  const infoWindowRef = useRef<naver.maps.InfoWindow | null>(null);

  // 초기 상태를 검증 결과에 따라 설정
  const [isLoading, setIsLoading] = useState(isValidClientId);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(
    isValidClientId ? null : "네이버 지도 API 키가 설정되지 않았습니다."
  );

  // 마커 및 이벤트 리스너 초기화
  const clearMarkers = useCallback(() => {
    // 이벤트 리스너 제거
    listenersRef.current.forEach((listener) => {
      naver.maps.Event.removeListener(listener);
    });
    listenersRef.current = [];

    // 마커 제거
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // InfoWindow 닫기
    infoWindowRef.current?.close();
  }, []);

  // 공유 InfoWindow 가져오기 (없으면 생성)
  const getSharedInfoWindow = useCallback(() => {
    if (!infoWindowRef.current) {
      infoWindowRef.current = new naver.maps.InfoWindow({
        content: "",
        backgroundColor: "#fff",
        borderColor: "#e5e7eb",
        anchorSize: new naver.maps.Size(10, 10),
      });
    }
    return infoWindowRef.current;
  }, []);

  // 마커 추가
  const addMarkers = useCallback(() => {
    if (!mapRef.current || !festival) return;

    clearMarkers();

    const infoWindow = getSharedInfoWindow();

    // 1. 축제 마커
    const festivalLatLng = toLatLng(festival.mapx || "", festival.mapy || "");
    if (festivalLatLng) {
      const festivalMarker = new naver.maps.Marker({
        position: festivalLatLng,
        map: mapRef.current,
        icon: createFestivalMarkerIcon(),
        title: festival.TITLE,
        zIndex: 100,
      });

      const festivalListener = naver.maps.Event.addListener(
        festivalMarker,
        "click",
        () => {
          infoWindow.setContent(createFestivalInfoContent(festival));
          infoWindow.open(mapRef.current!, festivalMarker);
        }
      );

      markersRef.current.push(festivalMarker);
      listenersRef.current.push(festivalListener);

      // 축제 위치로 지도 중심 이동
      mapRef.current.setCenter(festivalLatLng);
    }

    // 2. 맛집 마커들
    places.forEach((place) => {
      const placeLatLng = toLatLng(place.mapx, place.mapy);
      if (!placeLatLng) return;

      const placeMarker = new naver.maps.Marker({
        position: placeLatLng,
        map: mapRef.current!,
        icon: createPlaceMarkerIcon(),
        title: place.name,
        zIndex: 50,
      });

      const placeListener = naver.maps.Event.addListener(
        placeMarker,
        "click",
        () => {
          infoWindow.setContent(createPlaceInfoContent(place));
          infoWindow.open(mapRef.current!, placeMarker);
        }
      );

      markersRef.current.push(placeMarker);
      listenersRef.current.push(placeListener);
    });

    // 3. 지도 클릭 시 InfoWindow 닫기
    const mapClickListener = naver.maps.Event.addListener(
      mapRef.current,
      "click",
      () => {
        infoWindow.close();
      }
    );
    listenersRef.current.push(mapClickListener);
  }, [festival, places, clearMarkers, getSharedInfoWindow]);

  // 지도 초기화 (festival에 의존하지 않음 - 마커 추가 시 중심 이동)
  const initMap = useCallback(() => {
    if (!containerRef.current || !window.naver?.maps) return;

    const defaultCenter = new naver.maps.LatLng(37.5666805, 126.9784147);

    mapRef.current = new naver.maps.Map(containerRef.current, {
      center: defaultCenter,
      zoom: 16,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    });

    // 지도 idle 이벤트 후 ready 상태로 전환 (렌더링 완료 보장)
    naver.maps.Event.addListenerOnce(mapRef.current, 'idle', () => {
      setIsReady(true);
    });
  }, []);

  // 스크립트 로드 및 지도 초기화 (한 번만 실행)
  useEffect(() => {
    if (!isValidClientId) return;

    loadNaverMapScript(clientId)
      .then(() => {
        initMap();
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });

    return () => {
      clearMarkers();
      infoWindowRef.current = null;
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidClientId, clientId]);

  // festival/places 변경 시 마커 갱신
  useEffect(() => {
    if (isReady && !isLoading && mapRef.current) {
      addMarkers();
    }
  }, [isReady, isLoading, addMarkers]);

  return {
    containerRef,
    isLoading,
    isReady,
    error,
  };
}
