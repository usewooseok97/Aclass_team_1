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
      <div className="flex flex-col items-center justify-center py-12 px-4">
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
      </div>
    );
  }

  // Sort festivals by buzz_score (highest first)
  const sortedFestivals = [...filteredFestivals].sort(
    (a, b) => b.buzz_score - a.buzz_score
  );

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-4 max-h-150 overflow-y-auto pr-2">
        {sortedFestivals.map((festival) => (
          <FestivalCard
            key={`${festival.TITLE}-${festival.STRTDATE}`}
            festival={festival}
            onClick={() => setSelectedFestival(festival)}
          />
        ))}
      </div>
    </div>
  );
};

export { FestivalListContainer };
