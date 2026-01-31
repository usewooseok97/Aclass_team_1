import { useContext } from 'react';
import { FestivalContext, useData, useFilter, useNavigation } from '../contexts/FestivalContext';

// Combined hook for backward compatibility
export const useFestivalContext = () => {
  const context = useContext(FestivalContext);
  if (context === undefined) {
    throw new Error('useFestivalContext must be used within a FestivalProvider');
  }
  return context;
};

// Re-export individual hooks for selective subscription
// This allows components to subscribe to only the data they need,
// reducing unnecessary re-renders
export { useData, useFilter, useNavigation };
