import { useMemo, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import dayjs from "dayjs";
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

  // 모든 훅은 early return 이전에 선언해야 함 (React Hooks 규칙)
  const userLocation = useMemo(() => {
    if (geolocation.latitude && geolocation.longitude) {
      return { latitude: geolocation.latitude, longitude: geolocation.longitude };
    }
    return null;
  }, [geolocation.latitude, geolocation.longitude]);

  const festivalsWithDistance = useMemo(() => {
    return filteredFestivals.map((festival) => {
      const distance = userLocation
        ? calculateFestivalDistance(userLocation, festival)
        : null;
      return { festival, distance };
    });
  }, [filteredFestivals, userLocation]);

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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const handleScroll = useCallback(() => {
    setShowBackToTop((scrollContainerRef.current?.scrollTop ?? 0) > 150);
  }, []);

  const scrollToTop = useCallback(() => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // 훅 선언 완료 후 early return
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

  const today = dayjs();

  return (
    <div className="w-full relative">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex flex-col items-center gap-4 max-h-150 overflow-y-auto scrollbar-hide pr-2"
      >
        {sortedFestivals.map(({ festival, distance }, index) => {
          const isPast = dayjs(festival.END_DATE, 'YYYYMMDD').isBefore(today, 'day');
          return (
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
                isPast={isPast}
              />
            </motion.div>
          );
        })}
      </div>
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full shadow-md transition-all duration-200"
          style={{ backgroundColor: 'var(--btn-primary)', color: '#fff' }}
          aria-label="맨 위로"
        >
          ↑ 맨 위로
        </button>
      )}
    </div>
  );
};

export { FestivalListContainer };
