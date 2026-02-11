import { useMemo } from "react";
import { motion } from "motion/react";
import { useGeolocation } from "@uidotdev/usehooks";
import { useFestivalContext } from "../hooks/useFestivalContext";
import { useAuth } from "@/contexts/AuthContext";
import { FestivalCard } from "../components/FestivalCard";
import { calculateFestivalDistance, formatDistance } from "@/utils/distance";

const FestivalListContainer = () => {
  const { filteredFestivals, setSelectedFestival, navigateToDetail, selectedDistrict, favoriteFestivals, toggleFavorite, sortBy } =
    useFestivalContext();
  const { isAuthenticated } = useAuth();
  const geolocation = useGeolocation();

  if (!selectedDistrict) {
    return null;
  }

  if (filteredFestivals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 px-4"
      >
        <svg
          className="w-20 h-20 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-gray-500 text-center text-lg">
          {selectedDistrict}에는 등록된 축제가 없습니다.
        </p>
        <p className="text-gray-400 text-center text-sm mt-2">
          다른 지역을 선택해보세요.
        </p>
      </motion.div>
    );
  }

  // 사용자 위치 정보
  const userLocation = useMemo(() => {
    if (geolocation.latitude && geolocation.longitude) {
      return { latitude: geolocation.latitude, longitude: geolocation.longitude };
    }
    return null;
  }, [geolocation.latitude, geolocation.longitude]);

  // 축제별 거리 계산
  const festivalsWithDistance = useMemo(() => {
    return filteredFestivals.map((festival) => {
      const distance = userLocation
        ? calculateFestivalDistance(userLocation, festival)
        : null;
      return { festival, distance };
    });
  }, [filteredFestivals, userLocation]);

  // 정렬 로직
  const sortedFestivals = useMemo(() => {
    const sorted = [...festivalsWithDistance];
    if (sortBy === 'distance' && userLocation) {
      sorted.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    } else {
      sorted.sort((a, b) => b.festival.buzz_score - a.festival.buzz_score);
    }
    return sorted;
  }, [festivalsWithDistance, sortBy, userLocation]);

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
        {sortedFestivals.map(({ festival, distance }, index) => (
          <motion.div
            key={`${festival.TITLE}-${festival.STRTDATE}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
          >
            <FestivalCard
              festival={festival}
              onClick={() => {
                if (window.matchMedia('(max-width: 1279px)').matches) {
                  navigateToDetail(festival);
                } else {
                  setSelectedFestival(festival);
                }
              }}
              isFavorite={favoriteFestivals.has(festival.TITLE)}
              onToggleFavorite={isAuthenticated ? toggleFavorite : undefined}
              distance={distance !== null ? formatDistance(distance) : undefined}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export { FestivalListContainer };
