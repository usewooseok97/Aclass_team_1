import { Calendar, Heart, MapPin } from "lucide-react";
import type { DateFilterType, SortOption } from "@/types/festival";
import { FilterButton } from "@/atoms/FilterButton";

interface FilterButtonsProps {
  dateFilter: DateFilterType;
  onDateFilterChange: (filter: DateFilterType) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
  isLocationAvailable: boolean;
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
  sortBy,
  onSortChange,
  isLocationAvailable,
}: FilterButtonsProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {/* 전체 버튼 */}
      <FilterButton
        onClick={() => onDateFilterChange('all')}
        isActive={dateFilter === 'all'}
      >
        전체
      </FilterButton>

      {/* 현재 진행중 버튼 */}
      <FilterButton
        onClick={() => onDateFilterChange('ongoing')}
        isActive={dateFilter === 'ongoing'}
      >
        <Calendar className="w-4 h-4" />
        현재 진행중
      </FilterButton>

      {/* 찜한 축제만 보기 버튼 */}
      <FilterButton
        onClick={onToggleFavorites}
        isActive={showFavoritesOnly}
      >
        <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
        찜한 축제만 보기
      </FilterButton>

      {/* 가까운 순 버튼 */}
      <FilterButton
        onClick={() => onSortChange('distance')}
        isActive={sortBy === 'distance' && isLocationAvailable}
        disabled={!isLocationAvailable}
        title={!isLocationAvailable ? '위치 권한이 필요합니다' : ''}
      >
        <MapPin className="w-4 h-4" />
        가까운 순
      </FilterButton>
    </div>
  );
};
