import { useState, createContext, useEffect } from "react";
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';
import { Route, Routes } from "react-router";
import MainPage from "./pages/mainPage";

// ✅ 전역 상태 공유용 Context 생성
export const FestivalContext = createContext();

// ✅ API 기본 주소 (환경변수)
const baseURL = import.meta.env.VITE_SEOUL_KEY;

function App() {
  // ✅ 전체 축제 데이터 / 계절별 분류 데이터 상태
  const [festivalData, setFestivalData] = useState({
    all: [],                             // 전체 축제 데이터
    bySeason: { 봄: [], 여름: [], 가을: [], 겨울: [] }, // 계절별 축제 데이터
  });

  const [isLoading, setIsLoading] = useState(true);         // 로딩 중 여부
  const [currentSeason, setCurrentSeason] = useState('');   // 현재 선택된 계절
  const [selectedDistrict, setSelectedDistrict] = useState(''); // 현재 선택된 자치구

  // ✅ 월을 기반으로 계절 문자열 반환
  const getSeason = (month) => {
    if ([3, 4, 5].includes(month)) return '봄';
    if ([6, 7, 8].includes(month)) return '여름';
    if ([9, 10, 11].includes(month)) return '가을';
    return '겨울';
  };

  // ✅ API 호출 → 축제 데이터 가져오기 + 계절별 정리
  const fetchFestivalData = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/festivals`);
      const allRows = res.data;
      console.log("📦 응답 데이터 확인:", res.data);

      // ✅ 축제 데이터 가공: 필요한 항목만 추출 + 계절 구분
      const simplified = allRows.map((item) => {
        const startMonth = parseInt(item.STRTDATE.slice(5, 7)); // 시작 월 추출
        const season = getSeason(startMonth);
        return {
          season,
          GUNAME: item.GUNAME,
          TITLE: item.TITLE,
          DATE: item.DATE,
          PLACE: item.PLACE,
          ORG_NAME: item.ORG_NAME,
          USE_TRGT: item.USE_TRGT,
          MAIN_IMG: item.MAIN_IMG,
          IS_FREE: item.IS_FREE,
          HMPG_ADDR: item.HMPG_ADDR,
        };
      });

      // ✅ 계절별로 축제 정리
      const sorted = { 봄: [], 여름: [], 가을: [], 겨울: [] };
      simplified.forEach((item) => {
        sorted[item.season].push(item);
      });

      // ✅ 상태 반영
      setFestivalData({
        all: simplified,
        bySeason: sorted,
      });

      // ✅ 현재 날짜 기준으로 초기 계절 설정
      setCurrentSeason(getSeason(new Date().getMonth() + 1));
    } catch (err) {
      console.error("❌ 축제 데이터 불러오기 실패:", err);
    } finally {
      setIsLoading(false); // ✅ 로딩 완료
    }
  };

  // ✅ 컴포넌트 최초 마운트 시 축제 데이터 불러오기
  useEffect(() => {
    fetchFestivalData();
  }, []);

  return (
    // ✅ 부트스트랩 반응형 테마 적용 + Context Provider 설정
    <ThemeProvider breakpoints={['xxxl','xxl', 'xl', 'lg', 'md', 'sm', 'xs']} minBreakpoint="xxs">
      <FestivalContext.Provider value={{
        festivalData,          // 축제 데이터 (전체/계절별)
        isLoading,             // 로딩 상태
        currentSeason,         // 선택된 계절
        setCurrentSeason,      // 계절 변경 함수
        selectedDistrict,      // 선택된 자치구
        setSelectedDistrict    // 자치구 변경 함수
      }}>
        {/* ✅ 라우팅 설정: 현재는 메인 페이지만 존재 */}
        <Routes>
          <Route path="/" element={<MainPage />}/>
        </Routes>
      </FestivalContext.Provider>
    </ThemeProvider>
  );
}

export default App;