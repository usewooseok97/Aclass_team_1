import React, { createContext, useState, useContext, useCallback, type ReactNode } from 'react';
import type { Festival, Season, FilterContextValue } from '../types/festival';

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  onDistrictChange?: (district: string | null) => void;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, onDistrictChange }) => {
  const [selectedDistrict, setSelectedDistrictState] = useState<string | null>(null);
  const [selectedFestival, setSelectedFestivalState] = useState<Festival | null>(null);
  const [selectedSeason, setSelectedSeasonState] = useState<Season>('전체');

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

  const value: FilterContextValue = {
    selectedDistrict,
    selectedFestival,
    selectedSeason,
    setSelectedDistrict,
    setSelectedFestival,
    setSelectedSeason,
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
