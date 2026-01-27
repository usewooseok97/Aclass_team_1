/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect,type ReactNode, useMemo } from 'react';
import type {
  Festival,
  PlaceData,
  Weather,
  FestivalContextValue,
  ViewMode,
  Season,
} from '../types/festival';
 
export const FestivalContext = createContext<FestivalContextValue | undefined>(undefined);

 
export const FestivalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
 
  const [allFestivals, setAllFestivals] = useState<Festival[]>([]);
  const [allPlaces, setAllPlaces] = useState<PlaceData>({});
  const [weather, setWeather] = useState<Weather | null>(null);

  const [selectedDistrict, setSelectedDistrictState] = useState<string | null>(null);
  const [selectedFestival, setSelectedFestivalState] = useState<Festival | null>(null);
  const [selectedSeason, setSelectedSeasonState] = useState<Season>("전체");
  const [viewMode, setViewMode] = useState<ViewMode>('map');

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
    setSelectedFestivalState(null);
    if (district) {
      setViewMode('list');
    } else {
      setViewMode('map');
    }
  };

  const setSelectedFestival = (festival: Festival | null) => {
    setSelectedFestivalState(festival);
  };

  const setSelectedSeason = (season: Season) => {
    setSelectedSeasonState(season);
  };

  const navigateToDetail = (festival: Festival) => {
    setSelectedFestivalState(festival);
    setViewMode('detail');
  };

  const navigateBack = () => {
    if (viewMode === 'detail') {
      setViewMode(selectedDistrict ? 'list' : 'map');
    } else if (viewMode === 'list') {
      setSelectedDistrictState(null);
      setSelectedFestivalState(null);
      setViewMode('map');
    }
  };

 
  const filteredFestivals = useMemo(() => {
    let filtered = allFestivals;

    // 구 필터링
    if (selectedDistrict) {
      filtered = filtered.filter((festival) => festival.GUNAME === selectedDistrict);
    }

    // 계절 필터링
    if (selectedSeason !== "전체") {
      filtered = filtered.filter((festival) => festival.season === selectedSeason);
    }

    // 구가 선택되지 않았으면 빈 배열 반환 (기존 동작 유지)
    if (!selectedDistrict) {
      return [];
    }

    return filtered;
  }, [selectedDistrict, selectedSeason, allFestivals]);

 
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
    selectedSeason,
    viewMode,

    filteredFestivals,
    nearbyPlaces,

    setSelectedDistrict,
    setSelectedFestival,
    setSelectedSeason,
    setViewMode,
    navigateToDetail,
    navigateBack,

    isLoading,
    error,
  };

  return <FestivalContext.Provider value={value}>{children}</FestivalContext.Provider>;
};
