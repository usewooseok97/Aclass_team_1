import { useState } from 'react';
import { Star } from 'lucide-react';
import type { ChalkboardFormData } from '@/types/chalkboard';

interface ChalkboardInputProps {
  onSubmit: (formData: ChalkboardFormData) => void;
  disabled?: boolean;
}

/**
 * 칠판 댓글 입력 폼 컴포넌트
 * 화면 하단에 고정되어 있으며, 텍스트 입력과 별점 선택이 가능합니다.
 */
export const ChalkboardInput = ({ onSubmit, disabled = false }: ChalkboardInputProps) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (text.trim().length === 0) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    if (text.length > 10) {
      alert('댓글은 최대 10자까지 입력할 수 있습니다.');
      return;
    }

    onSubmit({ text: text.trim(), rating });
    setText('');
    setRating(5);
  };

  const displayRating = hoveredRating ?? rating;

  return (
    <div className="w-full bg-[#0f1f0f] border-t-4 border-[#2a3a2a] shadow-lg">
      <div className="w-full px-4 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          {/* 텍스트 입력 */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={disabled ? "로그인 후 이용 가능합니다" : "칠판에 메시지를 남겨주세요 (최대 10자)"}
            maxLength={10}
            disabled={disabled}
            className={`flex-1 px-3 py-2 bg-[#1a2e1a] text-white placeholder-gray-400 border-2 border-[#2a3a2a] rounded-lg focus:outline-none focus:border-[#4a5a4a] transition-colors text-sm ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ fontFamily: "'Schoolbell', cursive" }}
          />

          {/* 별점 선택 */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={20}
                  fill={star <= displayRating ? '#ffffba' : 'none'}
                  color={star <= displayRating ? '#ffffba' : '#4a5a4a'}
                />
              </button>
            ))}
          </div>

          {/* 등록 버튼 */}
          <button
            type="submit"
            disabled={disabled}
            className={`px-4 py-2 bg-[#2a4a2a] text-white font-bold rounded-lg hover:bg-[#3a5a3a] transition-colors border-2 border-[#3a5a3a] text-sm ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-[#2a4a2a]' : ''}`}
            style={{ fontFamily: "'Schoolbell', cursive" }}
          >
            등록
          </button>

          {/* 글자 수 표시 */}
          <div className="text-xs text-gray-400 min-w-[3rem]" style={{ fontFamily: "'Schoolbell', cursive" }}>
            {text.length}/10
          </div>
        </form>
      </div>
    </div>
  );
};
