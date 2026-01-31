import React, { createContext, useState, useContext, useCallback, type ReactNode } from 'react';
import type { Festival, ViewMode, NavigationContextValue } from '../types/festival';

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
  selectedDistrict: string | null;
  onFestivalSelect?: (festival: Festival | null) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
  selectedDistrict,
  onFestivalSelect,
}) => {
  const [viewMode, setViewModeState] = useState<ViewMode>('map');

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
  }, []);

  const navigateToDetail = useCallback(
    (festival: Festival) => {
      onFestivalSelect?.(festival);
      setViewModeState('detail');
    },
    [onFestivalSelect]
  );

  const navigateBack = useCallback(() => {
    if (viewMode === 'detail') {
      setViewModeState(selectedDistrict ? 'list' : 'map');
    } else if (viewMode === 'list') {
      setViewModeState('map');
    } else if (viewMode === 'notfound') {
      setViewModeState('map');
    }
  }, [viewMode, selectedDistrict]);

  const navigateToNotFound = useCallback(() => {
    setViewModeState('notfound');
  }, []);

  const value: NavigationContextValue = {
    viewMode,
    setViewMode,
    navigateToDetail,
    navigateBack,
    navigateToNotFound,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
