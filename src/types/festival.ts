// View mode type for page navigation
export type ViewMode = 'map' | 'list' | 'detail' | 'notfound';

// Season type for filtering
export type Season = "전체" | "봄" | "여름" | "가을" | "겨울";

// Festival data interface matching Python script output
export interface Festival {
  CODENAME: string | undefined;
  season: "봄" | "여름" | "가을" | "겨울";
  GUNAME: string;           // District name: "종로구", "강남구", etc.
  TITLE: string;            // Festival title
  DATE: string;             // Date range string (e.g., "2025-03-01 ~ 2025-03-31")
  PLACE: string;            // Location
  ORG_NAME: string;         // Organizer
  USE_TRGT: string;         // Target audience
  MAIN_IMG: string;         // Image URL
  IS_FREE: "무료" | "유료"; // Free/Paid
  HMPG_ADDR: string;        // Homepage URL
  PROGRAM: string;          // Program description
  STRTDATE: string;         // Start date YYYYMMDD
  END_DATE: string;         // End date YYYYMMDD
  buzz_score: number;       // Interest score 0-100
  mapx?: string;            // Longitude (Naver coordinate)
  mapy?: string;            // Latitude (Naver coordinate)
}

// Google Places photo reference
export interface PlacePhoto {
  name: string;             // Photo reference (e.g., "places/xxx/photos/xxx")
  widthPx: number;          // Photo width
  heightPx: number;         // Photo height
}

// Place (restaurant/cafe) data interface
export interface Place {
  name: string;             // Place name
  category: string;         // Category: "카페", "한식", "중식", etc.
  address: string;          // Address
  roadAddress: string;      // Road address
  mapx: string;             // Longitude (Naver coordinate)
  mapy: string;             // Latitude (Naver coordinate)
  link: string;             // Naver link
  telephone: string;        // Phone number
  googlePlaceId?: string;   // Google Places ID
  photos?: PlacePhoto[];    // Google Places photos
}

// Place data structure - keyed by festival title
export interface PlaceData {
  [festivalTitle: string]: Place[];
}

// Weather data interface
export interface Weather {
  lastUpdated: string;
  current: {
    temperature: number;
    sky: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: {
    maxTemp: number;
    minTemp: number;
    sky: string;
  };
}

// Data Context value interface
export interface DataContextValue {
  allFestivals: Festival[];
  allPlaces: PlaceData;
  weather: Weather | null;
  isLoading: boolean;
  error: string | null;
}

// Filter Context value interface
export interface FilterContextValue {
  selectedDistrict: string | null;
  selectedFestival: Festival | null;
  selectedSeason: Season;
  setSelectedDistrict: (district: string | null) => void;
  setSelectedFestival: (festival: Festival | null) => void;
  setSelectedSeason: (season: Season) => void;
}

// Navigation Context value interface
export interface NavigationContextValue {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  navigateToDetail: (festival: Festival) => void;
  navigateBack: () => void;
  navigateToNotFound: () => void;
}

// Combined Context value interface (for backward compatibility)
export interface FestivalContextValue
  extends DataContextValue,
    FilterContextValue,
    NavigationContextValue {
  filteredFestivals: Festival[];
  nearbyPlaces: Place[];
}
