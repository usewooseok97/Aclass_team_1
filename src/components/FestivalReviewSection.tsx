import { useState } from 'react';
import { ChalkboardComment } from '@/atoms/ChalkboardComment';
import { ChalkboardInput } from '@/components/ChalkboardInput';
import { CHALK_COLORS } from '@/types/chalkboard';
import type {
  ChalkboardComment as ChalkboardCommentType,
  ChalkboardFormData,
} from '@/types/chalkboard';

const getRandomPosition = (): { x: number; y: number } => ({
  x: Math.random() * 80 + 10,
  y: Math.random() * 60 + 10,
});

const getRandomFontSize = (): number => {
  return Math.random() * 1.5 + 1.5;
};

const getRandomRotation = (): number => {
  return Math.random() * 30 - 15;
};

const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * CHALK_COLORS.length);
  return CHALK_COLORS[randomIndex];
};

interface FestivalReviewSectionProps {
  festivalId: string;
  reviews?: ChalkboardCommentType[];
  onSubmit?: (formData: ChalkboardFormData) => void | Promise<void>;
  isLoading?: boolean;
}

export const FestivalReviewSection = ({
  festivalId,
  reviews = [],
  onSubmit,
  isLoading = false,
}: FestivalReviewSectionProps) => {
  const storageKey = `festival_reviews_${festivalId}`;

  const loadLocalReviews = (): ChalkboardCommentType[] => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load reviews from localStorage:', error);
    }
    return [];
  };

  const [localReviews, setLocalReviews] = useState<ChalkboardCommentType[]>(() => loadLocalReviews());

  const handleSubmit = async (formData: ChalkboardFormData) => {
    const newReview: ChalkboardCommentType = {
      id: `review-${Date.now()}-${Math.random()}`,
      text: formData.text,
      rating: formData.rating,
      x: getRandomPosition().x,
      y: getRandomPosition().y,
      fontSize: getRandomFontSize(),
      rotate: getRandomRotation(),
      color: getRandomColor(),
      createdAt: new Date().toISOString(),
    };

    if (onSubmit) {
      await onSubmit(formData);
    } else {
      const updatedReviews = [...localReviews, newReview];
      setLocalReviews(updatedReviews);
      try {
        localStorage.setItem(storageKey, JSON.stringify(updatedReviews));
      } catch (error) {
        console.error('Failed to save reviews to localStorage:', error);
      }
    }
  };

  const displayReviews = reviews.length > 0 ? reviews : localReviews;

  return (
    <div className="relative w-full min-h-97.5 overflow-hidden bg-[#1a2e1a] flex flex-col rounded-lg">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(42, 58, 42, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(42, 58, 42, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(42, 58, 42, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #1a2e1a 0%, #152615 100%)
          `,
        }}
      />

      <div className="relative z-10 pt-6 pb-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          축제 리뷰
        </h2>
        <p className="text-white/70 text-sm">
          이 축제에 대한 후기를 남겨주세요!
        </p>
      </div>

      <div className="relative z-10 flex-1 w-full overflow-visible">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p
              className="text-white text-lg"
              style={{ fontFamily: "'Schoolbell', cursive" }}
            >
              Loading...
            </p>
          </div>
        ) : displayReviews.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-white/50 text-lg">
              아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
            </p>
          </div>
        ) : (
          displayReviews.map((review) => (
            <ChalkboardComment key={review.id} comment={review} />
          ))
        )}
      </div>

      <div className="relative z-10 mt-auto">
        <ChalkboardInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
