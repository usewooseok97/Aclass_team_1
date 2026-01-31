/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useMemo, useCallback, type ReactNode } from 'react';
import type { Festival, FestivalContextValue } from '../types/festival';
import { DataProvider, useData } from './DataContext';
import { FilterProvider, useFilter } from './FilterContext';
import { NavigationProvider, useNavigation } from './NavigationContext';

export const FestivalContext = createContext<FestivalContextValue | undefined>(undefined);

// Inner component that combines all contexts
const FestivalContextCombiner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const data = useData();
  const filter = useFilter();
  const navigation = useNavigation();

  const filteredFestivals = useMemo(() => {
    if (!filter.selectedDistrict) return [];

    let filtered = data.allFestivals.filter(
      (festival) => festival.GUNAME === filter.selectedDistrict
    );

    if (filter.selectedSeason !== '전체') {
      filtered = filtered.filter((festival) => festival.season === filter.selectedSeason);
    }

    return filtered;
  }, [filter.selectedDistrict, filter.selectedSeason, data.allFestivals]);

  const nearbyPlaces = useMemo(() => {
    if (!filter.selectedFestival) return [];
    return data.allPlaces[filter.selectedFestival.TITLE] || [];
  }, [filter.selectedFestival, data.allPlaces]);

  const value: FestivalContextValue = useMemo(
    () => ({
      ...data,
      ...filter,
      ...navigation,
      filteredFestivals,
      nearbyPlaces,
    }),
    [data, filter, navigation, filteredFestivals, nearbyPlaces]
  );

  return <FestivalContext.Provider value={value}>{children}</FestivalContext.Provider>;
};

// Wrapper to connect Filter and Navigation contexts
const NavigationWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const filter = useFilter();

  const handleFestivalSelect = useCallback(
    (festival: Festival | null) => {
      filter.setSelectedFestival(festival);
    },
    [filter]
  );

  return (
    <NavigationProvider
      selectedDistrict={filter.selectedDistrict}
      onFestivalSelect={handleFestivalSelect}
    >
      <FestivalContextCombiner>{children}</FestivalContextCombiner>
    </NavigationProvider>
  );
};

// Wrapper to connect Navigation state changes to Filter
const FilterNavigationBridge: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigation = useNavigation();

  const handleDistrictChange = useCallback(
    (district: string | null) => {
      navigation.setViewMode(district ? 'list' : 'map');
    },
    [navigation]
  );

  return (
    <FilterProvider onDistrictChange={handleDistrictChange}>
      <NavigationWrapper>{children}</NavigationWrapper>
    </FilterProvider>
  );
};

// Main provider that composes all contexts
export const FestivalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DataProvider>
      <NavigationProvider selectedDistrict={null}>
        <FilterNavigationBridge>{children}</FilterNavigationBridge>
      </NavigationProvider>
    </DataProvider>
  );
};

// Re-export individual context hooks for selective subscription
export { useData } from './DataContext';
export { useFilter } from './FilterContext';
export { useNavigation } from './NavigationContext';
