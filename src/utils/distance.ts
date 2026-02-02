import { getDistance } from 'geolib';
import type { Festival } from '@/types/festival';

interface Coordinates {
  latitude: number;
  longitude: number;
}

/**
 * 사용자 위치와 축제 간 거리 계산 (미터 단위)
 */
export const calculateFestivalDistance = (
  userLocation: Coordinates,
  festival: Festival
): number | null => {
  if (!festival.mapx || !festival.mapy) {
    return null;
  }

  const festivalLng = parseFloat(festival.mapx);
  const festivalLat = parseFloat(festival.mapy);

  if (isNaN(festivalLng) || isNaN(festivalLat)) {
    return null;
  }

  return getDistance(
    { latitude: userLocation.latitude, longitude: userLocation.longitude },
    { latitude: festivalLat, longitude: festivalLng }
  );
};

/**
 * 거리 포맷팅 (1km 미만: "500m", 이상: "1.2km")
 */
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)}m`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)}km`;
};
