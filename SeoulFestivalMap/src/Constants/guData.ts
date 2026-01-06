interface SeoulDistrict {
  id: string;
  name: string;
}

interface SeoulMapData {
  name: string;
  areas: SeoulDistrict[];
}

const seoulMapData: SeoulMapData = {
  name: 'seoul-map',
  areas: [
    { id: 'gangseo', name: '강서구' },
    { id: 'yangcheon', name: '양천구' },
    { id: 'yeongdeungpo', name: '영등포구' },
    { id: 'guro', name: '구로구' },
    { id: 'geumcheon', name: '금천구' },
    { id: 'dongjak', name: '동작구' },
    { id: 'gwanak', name: '관악구' },
    { id: 'seocho', name: '서초구' },
    { id: 'gangnam', name: '강남구' },
    { id: 'songpa', name: '송파구' },
    { id: 'gangdong', name: '강동구' },
    { id: 'mapo', name: '마포구' },
    { id: 'seodaemun', name: '서대문구' },
    { id: 'jongno', name: '종로구' },
    { id: 'jung', name: '중구' },
    { id: 'yongsan', name: '용산구' },
    { id: 'eunpyeong', name: '은평구' },
    { id: 'seongbuk', name: '성북구' },
    { id: 'dongdaemun', name: '동대문구' },
    { id: 'seongdong', name: '성동구' },
    { id: 'dobong', name: '도봉구' },
    { id: 'nowon', name: '노원구' },
    { id: 'jungnang', name: '중랑구' },
    { id: 'gwangjin', name: '광진구' },
    { id: 'gangbuk', name: '강북구' },
  ],
};

export default seoulMapData;