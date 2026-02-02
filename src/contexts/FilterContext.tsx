import React, { createContext, useState, useContext, useCallback, useEffect, type ReactNode } from 'react';
import type { Festival, Season, DateFilterType, SortOption, FilterContextValue } from '../types/festival';
import { favoritesApi } from '../lib/api';
import { useAuth } from './AuthContext';

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  onDistrictChange?: (district: string | null) => void;
}

const FAVORITES_STORAGE_KEY = 'festival_favorites';

// LocalStorage에서 찜하기 목록 불러오기
const loadLocalFavorites = (): Set<string> => {
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
const saveLocalFavorites = (favorites: Set<string>) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, onDistrictChange }) => {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();

  const [selectedDistrict, setSelectedDistrictState] = useState<string | null>(null);
  const [selectedFestival, setSelectedFestivalState] = useState<Festival | null>(null);
  const [selectedSeason, setSelectedSeasonState] = useState<Season>('전체');
  const [dateFilter, setDateFilterState] = useState<DateFilterType>('all');
  const [favoriteFestivals, setFavoriteFestivalsState] = useState<Set<string>>(() => loadLocalFavorites());
  const [showFavoritesOnly, setShowFavoritesOnlyState] = useState(false);
  const [sortBy, setSortByState] = useState<SortOption>('buzz_score');

  // 로그인 시 서버에서 찜하기 목록 동기화
  useEffect(() => {
    const syncFavorites = async () => {
      if (isAuthenticated && token && !authLoading) {
        try {
          const { favorites } = await favoritesApi.getAll(token);
          const serverFavorites = new Set(favorites.map(f => f.festivalId));
          setFavoriteFestivalsState(serverFavorites);
          // 로컬 스토리지도 업데이트
          saveLocalFavorites(serverFavorites);
        } catch (error) {
          console.error('Failed to sync favorites from server:', error);
        }
      }
    };
    syncFavorites();
  }, [isAuthenticated, token, authLoading]);

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

  const toggleFavorite = useCallback(async (festivalId: string) => {
    console.log('🔄 toggleFavorite 호출:', festivalId);

    const isFavorite = favoriteFestivals.has(festivalId);
    const action = isFavorite ? '삭제' : '추가';

    // 낙관적 업데이트
    setFavoriteFestivalsState((prev) => {
      const newSet = new Set(prev);
      if (isFavorite) {
        newSet.delete(festivalId);
      } else {
        newSet.add(festivalId);
      }
      saveLocalFavorites(newSet);
      return newSet;
    });

    // 로그인 상태면 서버에도 동기화
    if (isAuthenticated && token) {
      try {
        if (isFavorite) {
          await favoritesApi.remove(festivalId, token);
        } else {
          await favoritesApi.add(festivalId, token);
        }
        console.log(`✅ 찜하기 ${action} 서버 동기화 완료`);
      } catch (error) {
        console.error(`Failed to ${action} favorite on server:`, error);
        // 서버 실패 시 롤백
        setFavoriteFestivalsState((prev) => {
          const newSet = new Set(prev);
          if (isFavorite) {
            newSet.add(festivalId);
          } else {
            newSet.delete(festivalId);
          }
          saveLocalFavorites(newSet);
          return newSet;
        });
      }
    } else {
      console.log(`✅ 찜하기 ${action} 완료 (로컬)`);
    }
  }, [favoriteFestivals, isAuthenticated, token]);

  const setShowFavoritesOnly = useCallback((show: boolean) => {
    setShowFavoritesOnlyState(show);
  }, []);

  const setSortBy = useCallback((option: SortOption) => {
    setSortByState(option);
  }, []);

  const value: FilterContextValue = {
    selectedDistrict,
    selectedFestival,
    selectedSeason,
    dateFilter,
    favoriteFestivals,
    showFavoritesOnly,
    sortBy,
    setSelectedDistrict,
    setSelectedFestival,
    setSelectedSeason,
    setDateFilter,
    toggleFavorite,
    setShowFavoritesOnly,
    setSortBy,
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
