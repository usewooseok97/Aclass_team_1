/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect,type ReactNode, useMemo } from 'react';
import type {
  Festival,
  PlaceData,
  Weather,
  FestivalContextValue,
} from '../types/festival';
 
export const FestivalContext = createContext<FestivalContextValue | undefined>(undefined);

 
export const FestivalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const [allFestivals, setAllFestivals] = useState<Festival[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceData>({});
  const [weather, setWeather] = useState<Weather | null>(null);

  const [selectedDistrict, setSelectedDistrictState] = useState<string | null>(null);
  const [selectedFestival, setSelectedFestival] = useState<Festival | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
 
        const festivalsResponse = await fetch('/data/festival_data.json');
        if (!festivalsResponse.ok) {
          throw new Error('Failed to load festival data');
        }
        const festivalsData: Festival[] = await festivalsResponse.json();
        setAllFestivals(festivalsData);

 
        const placesResponse = await fetch('/data/place_data.json');
        if (!placesResponse.ok) {
          throw new Error('Failed to load place data');
        }
        const placesData: PlaceData = await placesResponse.json();
        setAllPlaces(placesData);

 
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
 
  const setSelectedDistrict = (district: string | null) => {
    setSelectedDistrictState(district);
    setSelectedFestival(null); // Reset festival when district changes
  };

 
  const filteredFestivals = useMemo(() => {
    if (!selectedDistrict) {
      return [];
    }
    return allFestivals.filter((festival) => festival.GUNAME === selectedDistrict);
  }, [selectedDistrict, allFestivals]);

 
  const nearbyPlaces = useMemo(() => {
    if (!selectedFestival) {
      return [];
    }
    return allPlaces[selectedFestival.TITLE] || [];
  }, [selectedFestival, allPlaces]);

  const value: FestivalContextValue = {
    allFestivals,
    allPlaces,
    weather,

    selectedDistrict,
    selectedFestival,

    filteredFestivals,
    nearbyPlaces,

    setSelectedDistrict,
    setSelectedFestival,

    isLoading,
    error,
  };

  return <FestivalContext.Provider value={value}>{children}</FestivalContext.Provider>;
};
