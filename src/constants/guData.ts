export interface SeoulDistrict {
  id: string;
  name: string;
  center: { x: number; y: number }; // SVG 좌표계 기준 중심점
}

export interface SeoulMapData {
  name: string;
  areas: SeoulDistrict[];
}

const seoulMapData: SeoulMapData = {
  name: 'seoul-map',
  areas: [
    // { id: 'gangseo', name: '강서구', center: { x: 115, y: 340 } },
    { id: 'gangseo', name: '강서구', center: { x: 80, y: 440 } },
    { id: 'yangcheon', name: '양천구', center: { x: 240, y: 540 } },
    { id: 'yeongdeungpo', name: '영등포구', center: { x: 320, y: 610 } },
    { id: 'guro', name: '구로구', center: { x: 160, y: 680 } },
    { id: 'geumcheon', name: '금천구', center: { x: 330, y: 780 } },
    { id: 'dongjak', name: '동작구', center: { x: 470, y: 630 } },
    { id: 'gwanak', name: '관악구', center: { x: 400, y: 720 } },
    { id: 'seocho', name: '서초구', center: { x: 580, y: 650 } },
    { id: 'gangnam', name: '강남구', center: { x: 650, y: 610 } },
    { id: 'songpa', name: '송파구', center: { x: 770, y: 600 } },
    { id: 'gangdong', name: '강동구', center: { x: 930, y: 450 } },
    { id: 'mapo', name: '마포구', center: { x: 290, y: 420 } },
    { id: 'seodaemun', name: '서대문구', center: { x: 410, y: 350 } },
    { id: 'jongno', name: '종로구', center: { x: 480, y: 330 } },
    { id: 'jung', name: '중구', center: { x: 580, y: 440 } },
    { id: 'yongsan', name: '용산구', center: { x: 480, y: 490 } },
    { id: 'eunpyeong', name: '은평구', center: { x: 400, y: 240 } },
    { id: 'seongbuk', name: '성북구', center: { x: 550, y: 290 } },
    { id: 'dongdaemun', name: '동대문구', center: { x: 690, y: 350 } },
    { id: 'seongdong', name: '성동구', center: { x: 670, y: 500 } },
    { id: 'dobong', name: '도봉구', center: { x: 620, y: 70 } },
    { id: 'nowon', name: '노원구', center: { x: 710, y: 170 } },
    { id: 'jungnang', name: '중랑구', center: { x: 780, y: 300 } },
    { id: 'gwangjin', name: '광진구', center: { x: 770, y: 450 } },
    { id: 'gangbuk', name: '강북구', center: { x: 590, y: 150 } },
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