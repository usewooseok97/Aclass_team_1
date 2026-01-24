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
 * 카테고리별 기본 이미지 (Unsplash 무료 이미지)
 */
export const categoryImages: Record<string, string> = {
  "한식": "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=400&fit=crop",
  "카페": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop",
  "중식": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop",
  "일식": "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop",
  "양식": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop",
  "default": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop",
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
