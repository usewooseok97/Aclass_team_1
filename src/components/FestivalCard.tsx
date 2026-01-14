import { type Festival } from "../types/festival";

interface FestivalCardProps {
  festival: Festival;
  onClick: () => void;
}

const FestivalCard = ({ festival, onClick }: FestivalCardProps) => {
  // Convert buzz_score (0-100) to star rating (0-5)
  const rating = (festival.buzz_score / 20).toFixed(1);
  const fullStars = Math.floor(Number(rating));
  const hasHalfStar = Number(rating) - fullStars >= 0.5;

  return (
    <div
      onClick={onClick}
      className="w-114 h-12.5 bg-[#FDFDFD] rounded-[20px] flex items-center px-4 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Icon */}
      <span className="text-xl mr-3">🎪</span>

      {/* Title */}
      <span className="flex-1 text-sm font-medium text-black truncate">
        {festival.TITLE}
      </span>

      {/* Rating */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-500">({rating})</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < fullStars
                  ? "text-yellow-400"
                  : i === fullStars && hasHalfStar
                  ? "text-yellow-400"
                  : "text-gray-300"
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export { FestivalCard };
