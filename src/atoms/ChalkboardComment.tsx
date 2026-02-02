import { Star } from 'lucide-react';
import type { ChalkboardComment as ChalkboardCommentType } from '@/types/chalkboard';

interface ChalkboardCommentProps {
  comment: ChalkboardCommentType;
}

/**
 * 칠판에 표시되는 개별 댓글 컴포넌트
 * 랜덤한 위치, 크기, 각도, 색상으로 표시됩니다.
 */
export const ChalkboardComment = ({ comment }: ChalkboardCommentProps) => {
  const { text, rating, x, y, fontSize, rotate, color } = comment;

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        fontSize: `${fontSize}rem`,
        color: color,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        fontFamily: "'Schoolbell', cursive",
        textShadow: '0 0 2px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* 별점 표시 */}
      <div className="flex items-center gap-1 mb-1">
        {Array.from({ length: rating }).map((_, index) => (
          <Star
            key={index}
            size={fontSize * 12}
            fill={color}
            color={color}
            className="inline-block"
          />
        ))}
      </div>

      {/* 댓글 텍스트 */}
      <div className="font-bold">{text}</div>
    </div>
  );
};
