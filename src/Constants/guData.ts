interface SeoulDistrict {
  id: string;
  name: string;
  center: { x: number; y: number }; // SVG 좌표계 기준 중심점
}

interface SeoulMapData {
  name: string;
  areas: SeoulDistrict[];
}

const seoulMapData: SeoulMapData = {
  name: 'seoul-map',
  areas: [
    // { id: 'gangseo', name: '강서구', center: { x: 115, y: 340 } },
    { id: 'gangseo', name: '강서구', center: { x: 115, y: 440 } },
    { id: 'yangcheon', name: '양천구', center: { x: 180, y: 550 } },
    { id: 'yeongdeungpo', name: '영등포구', center: { x: 255, y: 550 } },
    { id: 'guro', name: '구로구', center: { x: 140, y: 530 } },
    { id: 'geumcheon', name: '금천구', center: { x: 200, y: 610 } },
    { id: 'dongjak', name: '동작구', center: { x: 360, y: 490 } },
    { id: 'gwanak', name: '관악구', center: { x: 360, y: 580 } },
    { id: 'seocho', name: '서초구', center: { x: 520, y: 550 } },
    { id: 'gangnam', name: '강남구', center: { x: 650, y: 530 } },
    { id: 'songpa', name: '송파구', center: { x: 790, y: 480 } },
    { id: 'gangdong', name: '강동구', center: { x: 850, y: 360 } },
    { id: 'mapo', name: '마포구', center: { x: 260, y: 305 } },
    { id: 'seodaemun', name: '서대문구', center: { x: 330, y: 280 } },
    { id: 'jongno', name: '종로구', center: { x: 420, y: 230 } },
    { id: 'jung', name: '중구', center: { x: 480, y: 320 } },
    { id: 'yongsan', name: '용산구', center: { x: 420, y: 390 } },
    { id: 'eunpyeong', name: '은평구', center: { x: 295, y: 180 } },
    { id: 'seongbuk', name: '성북구', center: { x: 530, y: 175 } },
    { id: 'dongdaemun', name: '동대문구', center: { x: 600, y: 240 } },
    { id: 'seongdong', name: '성동구', center: { x: 560, y: 340 } },
    { id: 'dobong', name: '도봉구', center: { x: 560, y: 50 } },
    { id: 'nowon', name: '노원구', center: { x: 650, y: 100 } },
    { id: 'jungnang', name: '중랑구', center: { x: 700, y: 220 } },
    { id: 'gwangjin', name: '광진구', center: { x: 700, y: 350 } },
    { id: 'gangbuk', name: '강북구', center: { x: 530, y: 100 } },
  ],
};

// 구 이름으로 중심 좌표 찾기
export const getDistrictCenter = (guName: string): { x: number; y: number } | null => {
  const district = seoulMapData.areas.find(area => area.name === guName);
  return district ? district.center : null;
};

// 구 이름으로 ID 찾기
export const getDistrictId = (guName: string): string | null => {
  const district = seoulMapData.areas.find(area => area.name === guName);
  return district ? district.id : null;
};

export default seoulMapData;