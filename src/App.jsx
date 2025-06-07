import { useState, useEffect, createContext } from "react"
import ThemeProvider from 'react-bootstrap/ThemeProvider'
import 'bootstrap/dist/css/bootstrap.min.css'

import axios from 'axios';
import FestivalList from './Component/Festivallist';

// ✅ Context 생성: 하위 컴포넌트에서 축제 데이터 접근 가능
export const FestivalContext = createContext();

const baseURL = import.meta.env.VITE_SEOUL_KEY;

function App() {
  // 축제 데이터 전체 / 계절별 분류
  const [festivalData, setFestivalData] = useState({
    all: [],
    bySeason: { 봄: [], 여름: [], 가을: [], 겨울: [] },
  });

  const [isLoading, setIsLoading] = useState(true);         // 로딩 상태
  const [currentSeason, setCurrentSeason] = useState('');    // 현재 계절
  const [selectedDistrict, setSelectedDistrict] = useState(''); // 선택된 자치구

  // ✅ 월을 계절로 변환
  const getSeason = (month) => {
    if ([3, 4, 5].includes(month)) return '봄';
    if ([6, 7, 8].includes(month)) return '여름';
    if ([9, 10, 11].includes(month)) return '가을';
    return '겨울';
  };

  // ✅ 축제 데이터 가져오기
  const fetchFestivalData = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/festivals`);
      const allRows = res.data;
      console.log("📦 응답 데이터 확인:", res.data);

      // 축제 데이터 간소화 + 계절 분류
      const simplified = allRows.map((item) => {
        const startMonth = parseInt(item.STRTDATE.slice(5, 7));
        const season = getSeason(startMonth);
        return {
          season,
          GUNAME: item.GUNAME,       // 구 이름
          TITLE: item.TITLE,         // 축제 이름
          DATE: item.DATE,           // 축제 기간
          PLACE: item.PLACE,         // 축제 장소
          ORG_NAME: item.ORG_NAME,   // 주체 기관?
          USE_TRGT: item.USE_TRGT,   // 참여자 기준
          MAIN_IMG: item.MAIN_IMG,   // 메인 이미지
          IS_FREE: item.IS_FREE,     // 무/유료 여부
          HMPG_ADDR: item.HMPG_ADDR, // 홈페이지 주소
        };
      });

      // 계절별로 분류된 배열에 저장
      const sorted = { 봄: [], 여름: [], 가을: [], 겨울: [] };
      simplified.forEach((item) => {
        sorted[item.season].push(item);
      });

      // 상태 업데이트
      setFestivalData({
        all: simplified,
        bySeason: sorted,
      });

      // 현재 계절 자동 설정
      setCurrentSeason(getSeason(new Date().getMonth() + 1));
    } catch (err) {
      console.error("축제 데이터 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 최초 렌더링 시 데이터 fetch
  useEffect(() => {
    fetchFestivalData();
  }, []);

  return (
    // ✅ 반응형 설정 포함한 부트스트랩 테마 적용
    <ThemeProvider breakpoints={['xxxl','xxl', 'xl', 'lg', 'md', 'sm', 'xs']} minBreakpoint="xxs">
      <FestivalContext.Provider value={{
        festivalData,
        isLoading,
        currentSeason,
        setCurrentSeason,
        selectedDistrict,
        setSelectedDistrict
      }}>
        {/* 하위 컴포넌트에서 context 사용 가능 */}
        <div className="container py-4">
          <h1>서울 계절별 축제</h1>
          <FestivalList /> {/* 축제 목록 출력 컴포넌트 */}
        </div>
      </FestivalContext.Provider>
    </ThemeProvider>
  )
}

export default App;