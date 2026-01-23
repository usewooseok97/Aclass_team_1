/**
 * Google Places API 유틸리티
 * photo.name을 사용하여 이미지 URL을 생성합니다.
 */

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

/**
 * Google Places photo reference로 이미지 URL 생성
 * @param photoName - photo.name (e.g., "places/xxx/photos/xxx")
 * @param maxHeight - 최대 높이 (기본값: 400)
 * @returns 이미지 URL
 */
export function getPhotoUrl(photoName: string, maxHeight = 400): string {
  if (!photoName || !GOOGLE_API_KEY) {
    return "";
  }
  return `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=${maxHeight}&key=${GOOGLE_API_KEY}`;
}

/**
 * 카테고리별 기본 이미지
 */
export const categoryImages: Record<string, string> = {
  "한식": "/images/korean-food.jpg",
  "카페": "/images/cafe.jpg",
  "중식": "/images/chinese-food.jpg",
  "일식": "/images/japanese-food.jpg",
  "양식": "/images/western-food.jpg",
  "default": "/images/restaurant-default.jpg",
};

/**
 * 카테고리에서 기본 이미지 가져오기
 * @param category - 카테고리 문자열 (예: "카페,디저트>와플")
 * @returns 이미지 경로
 */
export function getCategoryImage(category: string): string {
  // 카테고리에서 주요 키워드 찾기
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("카페") || lowerCategory.includes("디저트")) {
    return categoryImages["카페"];
  }
  if (lowerCategory.includes("한식") || lowerCategory.includes("한정식")) {
    return categoryImages["한식"];
  }
  if (lowerCategory.includes("중식") || lowerCategory.includes("중화")) {
    return categoryImages["중식"];
  }
  if (lowerCategory.includes("일식") || lowerCategory.includes("초밥") || lowerCategory.includes("라멘")) {
    return categoryImages["일식"];
  }
  if (lowerCategory.includes("양식") || lowerCategory.includes("이탈리안") || lowerCategory.includes("파스타")) {
    return categoryImages["양식"];
  }

  return categoryImages["default"];
}
