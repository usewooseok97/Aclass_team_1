import { useState, useEffect, useCallback } from 'react';

interface UseSearchStateOptions {
  debounceDelay?: number;
}

export const useSearchState = (options: UseSearchStateOptions = {}) => {
  const { debounceDelay = 300 } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      if (searchTerm.trim()) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      setSelectedIndex(null);
      setHighlightedIndex(-1);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(null);
    setHighlightedIndex(-1);
  }, []);

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index);
    setIsOpen(false);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    debouncedTerm,
    isOpen,
    setIsOpen,
    selectedIndex,
    setSelectedIndex,
    highlightedIndex,
    setHighlightedIndex,
    handleClear,
    handleSelect,
  };
};
