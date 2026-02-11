import { useState, useEffect } from 'react';
import { ChalkboardComment } from '@/atoms/ChalkboardComment';
import { ChalkboardInput } from '@/components/ChalkboardInput';
import { CHALK_COLORS } from '@/types/chalkboard';
import type {
  ChalkboardComment as ChalkboardCommentType,
  ChalkboardFormData,
} from '@/types/chalkboard';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsApi, type Review } from '@/lib/api';

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

// 서버 리뷰를 ChalkboardComment 형식으로 변환
const convertServerReview = (review: Review): ChalkboardCommentType => ({
  id: `server-${review.id}`,
  text: review.text,
  rating: review.rating,
  x: review.x,
  y: review.y,
  fontSize: review.fontSize,
  rotate: review.rotate,
  color: review.color,
  createdAt: review.createdAt,
  userName: review.userName,
});

interface FestivalReviewSectionProps {
  festivalId: string;
  festivalEndDate?: string; // YYYYMMDD 형식
  readOnly?: boolean;
}

export const FestivalReviewSection = ({
  festivalId,
  festivalEndDate,
  readOnly = false,
}: FestivalReviewSectionProps) => {
  const { isAuthenticated, token, user } = useAuth();
  const [reviews, setReviews] = useState<ChalkboardCommentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 서버에서 리뷰 불러오기
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      try {
        const { reviews: serverReviews } = await reviewsApi.getByFestival(festivalId);
        setReviews(serverReviews.map(convertServerReview));

        // 현재 유저가 이미 리뷰를 작성했는지 확인
        if (user) {
          const myReview = serverReviews.find(r => r.userName === user.nickname);
          setHasSubmitted(!!myReview);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        const storageKey = `festival_reviews_${festivalId}`;
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored) {
            setReviews(JSON.parse(stored));
          }
        } catch {
          // ignore
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, [festivalId, user]);

  const handleSubmit = async (formData: ChalkboardFormData) => {
    setError(null);

    if (!isAuthenticated || !token) {
      setError('리뷰를 작성하려면 로그인이 필요합니다.');
      return;
    }

    // YYYYMMDD → YYYY-MM-DD 변환 (서버 API 형식)
    const formattedEndDate = festivalEndDate && festivalEndDate.length === 8
      ? `${festivalEndDate.slice(0, 4)}-${festivalEndDate.slice(4, 6)}-${festivalEndDate.slice(6, 8)}`
      : festivalEndDate || '2099-12-31';

    const reviewData = {
      text: formData.text,
      rating: formData.rating,
      x: getRandomPosition().x,
      y: getRandomPosition().y,
      fontSize: getRandomFontSize(),
      rotate: getRandomRotation(),
      color: getRandomColor(),
      festivalEndDate: formattedEndDate,
    };

    try {
      await reviewsApi.create(festivalId, reviewData, token);

      // 리뷰 목록 새로고침
      const { reviews: serverReviews } = await reviewsApi.getByFestival(festivalId);
      setReviews(serverReviews.map(convertServerReview));
      setHasSubmitted(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('리뷰 작성에 실패했습니다.');
      }
    } finally {
      // submit 완료
    }
  };

  const showInput = !readOnly && !hasSubmitted && isAuthenticated;

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
          {readOnly
            ? '상세 페이지에서 리뷰를 작성할 수 있습니다.'
            : hasSubmitted
            ? '리뷰를 작성해주셔서 감사합니다!'
            : isAuthenticated
            ? '이 축제에 대한 후기를 남겨주세요!'
            : '로그인하면 리뷰를 작성할 수 있습니다.'}
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
        ) : reviews.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-white/50 text-lg">
              아직 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
            </p>
          </div>
        ) : (
          reviews.map((review) => (
            <ChalkboardComment key={review.id} comment={review} />
          ))
        )}
      </div>

      {error && (
        <div className="relative z-10 px-4 py-2 mx-4 mb-2 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      {showInput && (
        <div className="relative z-10 mt-auto">
          <ChalkboardInput
            onSubmit={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};
