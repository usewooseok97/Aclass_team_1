import { motion } from "motion/react";
import { useFestivalContext } from "../hooks/useFestivalContext";
import { FestivalCard } from "../components/FestivalCard";

const FestivalListContainer = () => {
  const { filteredFestivals, setSelectedFestival, selectedDistrict } =
    useFestivalContext();

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

  // Sort festivals by buzz_score (highest first)
  const sortedFestivals = [...filteredFestivals].sort(
    (a, b) => b.buzz_score - a.buzz_score
  );

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4 max-h-150 overflow-y-auto pr-2">
        {sortedFestivals.map((festival, index) => (
          <motion.div
            key={`${festival.TITLE}-${festival.STRTDATE}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3 }}
          >
            <FestivalCard
              festival={festival}
              onClick={() => setSelectedFestival(festival)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export { FestivalListContainer };
