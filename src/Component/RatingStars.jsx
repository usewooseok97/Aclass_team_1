import { Star } from "lucide-react";

export function RatingStars({ rating }) {
  const stars = Math.round(rating);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {[...Array(5)].map((_, i) => {
        const isFilled = i < stars;
        return (
          <Star
            key={i}
            className={`w-4 h-4 ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}
            fill={isFilled ? "#fbbf24" : "none"}    // 채워진 별은 노란색 채우기
            stroke={isFilled ? "#fbbf24" : "#d1d5db"} // 채워진 별은 노란색 선, 빈 별은 회색 선
            strokeWidth={2}
          />
        );
      })}
    </span>
  );
};