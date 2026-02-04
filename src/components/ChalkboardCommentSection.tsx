import { useState } from 'react';
import { ChalkboardComment } from '@/atoms/ChalkboardComment';
import { ChalkboardInput } from '@/components/ChalkboardInput';
import { useAuth } from '@/contexts/AuthContext';
import { CHALK_COLORS } from '@/types/chalkboard';
import type {
  ChalkboardComment as ChalkboardCommentType,
  ChalkboardFormData,
} from '@/types/chalkboard';

/**
 * 랜덤 값 생성 유틸리티 함수들
 */
const getRandomPosition = (): { x: number; y: number } => ({
  x: Math.random() * 80 + 10, // 10% ~ 90%
  y: Math.random() * 60 + 10, // 10% ~ 70% (하단 입력창 공간 확보)
});

const getRandomFontSize = (): number => {
  return Math.random() * 1.5 + 1.5; // 1.5rem ~ 3rem
};

const getRandomRotation = (): number => {
  return Math.random() * 30 - 15; // -15도 ~ 15도
};

const getRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * CHALK_COLORS.length);
  return CHALK_COLORS[randomIndex];
};

interface ChalkboardCommentSectionProps {
  /** 축제 ID (백엔드 API 호출 시 사용) */
  festivalId?: string;
  /** 백엔드에서 가져온 댓글 목록 */
  comments?: ChalkboardCommentType[];
  /** 댓글 등록 핸들러 (백엔드 API 호출) */
  onSubmit?: (formData: ChalkboardFormData) => void | Promise<void>;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * 칠판 댓글 섹션 컴포넌트
 * 메인 페이지의 CardLayout 내부에서 사용됩니다.
 * 백엔드 연동을 위한 Props 인터페이스를 제공합니다.
 */
export const ChalkboardCommentSection = ({
  festivalId: _festivalId,
  comments = [],
  onSubmit,
  isLoading = false,
}: ChalkboardCommentSectionProps) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  // 임시 로컬 상태 (백엔드 연동 전까지 사용)
  const [localComments, setLocalComments] = useState<ChalkboardCommentType[]>(comments);

  // 댓글 등록 처리
  const handleSubmit = async (formData: ChalkboardFormData) => {
    // 로그인 체크: 비로그인 시 로그인 모달 열기
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const newComment: ChalkboardCommentType = {
      id: `comment-${Date.now()}-${Math.random()}`,
      text: formData.text,
      rating: formData.rating,
      x: getRandomPosition().x,
      y: getRandomPosition().y,
      fontSize: getRandomFontSize(),
      rotate: getRandomRotation(),
      color: getRandomColor(),
      createdAt: new Date().toISOString(),
    };

    // 백엔드 연동 시 onSubmit prop 사용
    if (onSubmit) {
      await onSubmit(formData);
    } else {
      // 임시: 로컬 상태에만 추가 (백엔드 연동 전)
      setLocalComments((prev) => [...prev, newComment]);
    }
  };

  const displayComments = comments.length > 0 ? comments : localComments;

  return (
    <div className="relative w-full min-h-97.5 overflow-hidden bg-[#1a2e1a] flex flex-col">
      {/* 칠판 텍스처 배경 */}
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

      {/* 칠판 제목 */}
      <div className="relative z-10 pt-6 pb-4 text-center">
        <h2
          className="text-3xl font-bold text-white mb-2"
        >
          칠판에 메시지를 남겨보세요!
        </h2>
      </div>

      {/* 댓글 표시 영역 */}
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
        ) : (
          displayComments.map((comment) => (
            <ChalkboardComment key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* 입력 폼 */}
      <div className="relative z-10 mt-auto">
        <ChalkboardInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};
