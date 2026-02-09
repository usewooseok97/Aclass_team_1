import { memo } from "react";
import { motion } from "motion/react";
import { type Festival } from "../types/festival";
import { calculateRating } from "@/utils/rating";
import { PartyPopper, Star, Heart, MapPin } from "lucide-react";

interface FestivalCardProps {
  festival: Festival;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (festivalId: string) => void;
  distance?: string;
}

const FestivalCard = memo(({ festival, onClick, isFavorite = false, onToggleFavorite, distance }: FestivalCardProps) => {
  // Convert buzz_score (0-100) to star rating (0-5)
  const { rating, fullStars, hasHalfStar } = calculateRating(festival.buzz_score);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!onToggleFavorite) return;

    onToggleFavorite(festival.TITLE);
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="relative w-114 h-12.5 rounded-[20px] flex items-center px-4 cursor-pointer hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
      }}
    >
      {/* 찜하기 하트 아이콘 */}
      {onToggleFavorite && (
        <button
          type="button"
          onClick={handleFavoriteClick}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full hover:bg-gray-100/10 transition-colors"
          aria-label={isFavorite ? '찜하기 취소' : '찜하기'}
          style={{ pointerEvents: 'auto' }}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </button>
      )}

      {/* Icon */}
      <PartyPopper className="w-5 h-5 mr-3 ml-6" style={{ color: 'var(--btn-primary)' }} />

      {/* Title */}
      <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
        {festival.TITLE}
      </span>

      {/* Distance */}
      {distance && (
        <div className="flex items-center gap-1 mr-3" style={{ color: 'var(--text-secondary)' }}>
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{distance}</span>
        </div>
      )}

      {/* Rating */}
      <div
        className="flex items-center gap-1"
        role="img"
        aria-label={`평점 ${rating}점`}
      >
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>({rating})</span>
        <div className="flex" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < fullStars
                  ? "text-yellow-400 fill-yellow-400"
                  : i === fullStars && hasHalfStar
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
});

FestivalCard.displayName = "FestivalCard";

export { FestivalCard };
