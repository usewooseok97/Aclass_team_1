import { memo } from "react";
import { motion } from "motion/react";
import { type Festival } from "../types/festival";
import { PartyPopper, Star } from "lucide-react";

interface FestivalCardProps {
  festival: Festival;
  onClick: () => void;
}

const FestivalCard = memo(({ festival, onClick }: FestivalCardProps) => {
  // Convert buzz_score (0-100) to star rating (0-5)
  const rating = (festival.buzz_score / 20).toFixed(1);
  const fullStars = Math.floor(Number(rating));
  const hasHalfStar = Number(rating) - fullStars >= 0.5;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="w-114 h-12.5 rounded-[20px] flex items-center px-4 cursor-pointer hover:shadow-lg transition-shadow"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
      }}
    >
      {/* Icon */}
      <PartyPopper className="w-5 h-5 mr-3" style={{ color: 'var(--btn-primary)' }} />

      {/* Title */}
      <span className="flex-1 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
        {festival.TITLE}
      </span>

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
