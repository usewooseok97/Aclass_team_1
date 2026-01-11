import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import type {
  Festival,
  Place,
  PlaceData,
  Weather,
  FestivalContextValue,
} from '../types/festival';

// Create context with undefined default (will be provided by Provider)
const FestivalContext = createContext<FestivalContextValue | undefined>(undefined);

// Provider component
export const FestivalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Data state
  const [allFestivals, setAllFestivals] = useState<Festival[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceData>({});
  const [weather, setWeather] = useState<Weather | null>(null);

  // Selection state
  const [selectedDistrict, setSelectedDistrictState] = useState<string | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  // Loading and error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from JSON files on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load festivals
        const festivalsResponse = await fetch('/data/festival_data.json');
        if (!festivalsResponse.ok) {
          throw new Error('Failed to load festival data');
        }
        const festivalsData: Festival[] = await festivalsResponse.json();
        setAllFestivals(festivalsData);

        // Load places
        const placesResponse = await fetch('/data/place_data.json');
        if (!placesResponse.ok) {
          throw new Error('Failed to load place data');
        }
        const placesData: PlaceData = await placesResponse.json();
        setAllPlaces(placesData);

        // Load weather
        const weatherResponse = await fetch('/data/weather_data.json');
        if (!weatherResponse.ok) {
          throw new Error('Failed to load weather data');
        }
        const weatherData: Weather = await weatherResponse.json();
        setWeather(weatherData);

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('데이터를 불러올 수 없습니다. public/data/ 폴더의 JSON 파일을 확인해주세요.');
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Custom setter for selectedDistrict that resets selectedFestival
  const setSelectedDistrict = (district: string | null) => {
    setSelectedDistrictState(district);
    setSelectedFestival(null); // Reset festival when district changes
  };

  // Compute filtered festivals based on selected district
  const filteredFestivals = useMemo(() => {
    if (!selectedDistrict) {
      return [];
    }
    return allFestivals.filter((festival) => festival.GUNAME === selectedDistrict);
  }, [selectedDistrict, allFestivals]);

  // Compute nearby places based on selected festival
  const nearbyPlaces = useMemo(() => {
    if (!selectedFestival) {
      return [];
    }
    return allPlaces[selectedFestival.TITLE] || [];
  }, [selectedFestival, allPlaces]);

  const value: FestivalContextValue = {
    // Data
    allFestivals,
    allPlaces,
    weather,

    // Selection state
    selectedDistrict,
    selectedFestival,

    // Computed values
    filteredFestivals,
    nearbyPlaces,

    // Actions
    setSelectedDistrict,
    setSelectedFestival,

    // Loading/Error
    isLoading,
    error,
  };

  return <FestivalContext.Provider value={value}>{children}</FestivalContext.Provider>;
};

// Custom hook to use the context
export const useFestivalContext = () => {
  const context = useContext(FestivalContext);
  if (context === undefined) {
    throw new Error('useFestivalContext must be used within a FestivalProvider');
  }
  return context;
};
