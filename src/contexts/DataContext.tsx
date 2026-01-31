import React, { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import type { Festival, PlaceData, Weather, DataContextValue } from '../types/festival';

const DataContext = createContext<DataContextValue | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allFestivals, setAllFestivals] = useState<Festival[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceData>({});
  const [weather, setWeather] = useState<Weather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [festivalsResponse, placesResponse, weatherResponse] = await Promise.all([
          fetch('/data/festival_data.json'),
          fetch('/data/place_data.json'),
          fetch('/data/weather_data.json'),
        ]);

        if (!festivalsResponse.ok) throw new Error('Failed to load festival data');
        if (!placesResponse.ok) throw new Error('Failed to load place data');
        if (!weatherResponse.ok) throw new Error('Failed to load weather data');

        const [festivalsData, placesData, weatherData] = await Promise.all([
          festivalsResponse.json() as Promise<Festival[]>,
          placesResponse.json() as Promise<PlaceData>,
          weatherResponse.json() as Promise<Weather>,
        ]);

        setAllFestivals(festivalsData);
        setAllPlaces(placesData);
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

  const value: DataContextValue = {
    allFestivals,
    allPlaces,
    weather,
    isLoading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
