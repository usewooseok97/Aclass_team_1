import { useContext } from 'react';
import { FestivalContext } from '../contexts/FestivalContext';

export const useFestivalContext = () => {
  const context = useContext(FestivalContext);
  if (context === undefined) {
    throw new Error('useFestivalContext must be used within a FestivalProvider');
  }
  return context;
};
