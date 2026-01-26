import { Star } from "lucide-react";
import { cn } from "@lib/utils";

interface StarRatingProps {
  rating: number;
  showNumber?: boolean;
  reviewCount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "w-3 h-3",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const StarRating = ({
  rating,
  showNumber = true,
  reviewCount,
  size = "md",
  className,
}: StarRatingProps) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      role="img"
      aria-label={`평점 ${rating.toFixed(1)}점`}
    >
      <div className="flex" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              sizeMap[size],
              i < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            )}
          />
        ))}
      </div>
      {showNumber && (
        <span
          className={cn(textSizeMap[size])}
          style={{ color: "var(--text-secondary)" }}
        >
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span
          className={cn(textSizeMap[size])}
          style={{ color: "var(--text-secondary)" }}
        >
          ({reviewCount.toLocaleString()}개의 리뷰)
        </span>
      )}
    </div>
  );
};
