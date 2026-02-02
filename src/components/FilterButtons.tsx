import { Calendar, Heart } from "lucide-react";
import type { DateFilterType } from "@/types/festival";

interface FilterButtonsProps {
  dateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

/**
 * 통합 필터 버튼 컴포넌트
 * "전체", "현재 진행중", "찜한 축제만 보기" 버튼을 같은 높이로 나란히 배치
 */
export const FilterButtons = ({
  dateFilter,
  onDateFilterChange,
  showFavoritesOnly,
  onToggleFavorites,
}: FilterButtonsProps) => {
  // 공통 버튼 스타일 함수
  const getButtonClass = (isActive: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
      isActive
        ? 'bg-purple-600 text-white shadow-md'
        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
    }`;

  return (
    <div className="flex gap-2 flex-wrap">
      {/* 전체 버튼 */}
      <button
        onClick={() => onDateFilterChange('all')}
        className={getButtonClass(dateFilter === 'all')}
        style={{
          ...(dateFilter === 'all' && {
            backgroundColor: 'var(--btn-primary)',
          }),
        }}
      >
        전체
      </button>

      {/* 현재 진행중 버튼 */}
      <button
        onClick={() => onDateFilterChange('ongoing')}
        className={getButtonClass(dateFilter === 'ongoing')}
        style={{
          ...(dateFilter === 'ongoing' && {
            backgroundColor: 'var(--btn-primary)',
          }),
        }}
      >
        <Calendar className="w-4 h-4" />
        현재 진행중
      </button>

      {/* 찜한 축제만 보기 버튼 */}
      <button
        onClick={onToggleFavorites}
        className={getButtonClass(showFavoritesOnly)}
        style={{
          ...(showFavoritesOnly && {
            backgroundColor: 'var(--btn-primary)',
          }),
        }}
      >
        <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
        찜한 축제만 보기
      </button>
    </div>
  );
};
