// 축제 제목 URL 인코딩
export const encodeFestivalTitle = (title: string): string => {
  return encodeURIComponent(title);
};

// 축제 제목 URL 디코딩
export const decodeFestivalTitle = (encoded: string): string => {
  return decodeURIComponent(encoded);
};

// 지역구 URL 인코딩
export const encodeDistrict = (district: string): string => {
  return encodeURIComponent(district);
};

// 지역구 URL 디코딩
export const decodeDistrict = (encoded: string): string => {
  return decodeURIComponent(encoded);
};

// 유효한 서울 지역구 목록
export const VALID_DISTRICTS = [
  '강서구', '양천구', '영등포구', '구로구', '금천구', '동작구', '관악구',
  '서초구', '강남구', '송파구', '강동구', '마포구', '서대문구', '종로구',
  '중구', '용산구', '은평구', '성북구', '동대문구', '성동구', '도봉구',
  '노원구', '중랑구', '광진구', '강북구'
];

export const isValidDistrict = (district: string): boolean => {
  return VALID_DISTRICTS.includes(district);
};
