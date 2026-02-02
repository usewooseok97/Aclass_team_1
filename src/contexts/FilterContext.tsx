import React, { createContext, useState, useContext, useCallback, type ReactNode } from 'react';
import type { Festival, Season, DateFilterType, FilterContextValue } from '../types/festival';

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  onDistrictChange?: (district: string | null) => void;
}

const FAVORITES_STORAGE_KEY = 'festival_favorites';

// LocalStorage에서 찜하기 목록 불러오기
const loadFavorites = (): Set<string> => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
  }
  return new Set();
};

// LocalStorage에 찜하기 목록 저장
const saveFavorites = (favorites: Set<string>) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, onDistrictChange }) => {
  const [selectedDistrict, setSelectedDistrictState] = useState<string | null>(null);
  const [selectedFestival, setSelectedFestivalState] = useState<Festival | null>(null);
  const [selectedSeason, setSelectedSeasonState] = useState<Season>('전체');
  const [dateFilter, setDateFilterState] = useState<DateFilterType>('all');
  const [favoriteFestivals, setFavoriteFestivalsState] = useState<Set<string>>(() => loadFavorites());
  const [showFavoritesOnly, setShowFavoritesOnlyState] = useState(false);

  const setSelectedDistrict = useCallback(
    (district: string | null) => {
      setSelectedDistrictState(district);
      setSelectedFestivalState(null);
      onDistrictChange?.(district);
    },
    [onDistrictChange]
  );

  const setSelectedFestival = useCallback((festival: Festival | null) => {
    setSelectedFestivalState(festival);
  }, []);

  const setSelectedSeason = useCallback((season: Season) => {
    setSelectedSeasonState(season);
  }, []);

  const setDateFilter = useCallback((filter: DateFilterType) => {
    setDateFilterState(filter);
  }, []);

  const toggleFavorite = useCallback((festivalId: string) => {
    console.log('🔄 toggleFavorite 호출:', festivalId);
    setFavoriteFestivalsState((prev) => {
      const newSet = new Set(prev);
      const action = newSet.has(festivalId) ? '삭제' : '추가';
      if (newSet.has(festivalId)) {
        newSet.delete(festivalId);
      } else {
        newSet.add(festivalId);
      }
      console.log(`✅ 찜하기 ${action} 완료. 현재 찜 목록:`, Array.from(newSet));
      saveFavorites(newSet);
      return newSet;
    });
  }, []);

  const setShowFavoritesOnly = useCallback((show: boolean) => {
    setShowFavoritesOnlyState(show);
  }, []);

  const value: FilterContextValue = {
    selectedDistrict,
    selectedFestival,
    selectedSeason,
    dateFilter,
    favoriteFestivals,
    showFavoritesOnly,
    setSelectedDistrict,
    setSelectedFestival,
    setSelectedSeason,
    setDateFilter,
    toggleFavorite,
    setShowFavoritesOnly,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
