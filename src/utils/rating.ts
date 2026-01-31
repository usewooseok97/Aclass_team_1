export interface RatingResult {
  rating: number;
  fullStars: number;
  hasHalfStar: boolean;
}

export const calculateRating = (buzzScore: number): RatingResult => {
  const rating = Number((buzzScore / 20).toFixed(1));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  return { rating, fullStars, hasHalfStar };
};
