import { useState, createContext, useEffect } from "react";
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router";
import MainPage from "./pages/MainPage";
import { getFestivalData } from "./services/axiosServices";
import { calculateTopDistricts, getSeason, simplifyFestivalData, sortBySeason } from "./utilFunction/festivalUtils";
import NotFoundPage from "./pages/NotFound";
import DetailPage from "./pages/DetailPage";

// ✅ 전역 상태 공유용 Context 생성
export const FestivalContext = createContext();

function App() {
  // ✅ 전체 축제 데이터 / 계절별 분류 데이터 상태
  const [festivalData, setFestivalData] = useState({
    all: [],                             // 전체 축제 데이터
    bySeason: { 봄: [], 여름: [], 가을: [], 겨울: [] }, // 계절별 축제 데이터
  });

  const [isLoading, setIsLoading] = useState(true);         // 데이터 로딩 상태 여부
  const [currentSeason, setCurrentSeason] = useState('');   // 사용자가 선택한 현재 계절
  const [selectedDistrict, setSelectedDistrict] = useState(''); // 현재 선택된 서울 자치구
  const [selectedFestival, setSelectedFestival] = useState(null); // 현재 상세보기를 눌러 선택된 축제
  const [topDistricts, setTopDistricts] = useState([]);      // 평점 평균 기준 상위 3개 자치구
  const [sidebarVisible, setSidebarVisible] = useState(false); // 사이드바 표시 여부
// ✅ 축제 데이터를 비동기로 fetch하여 상태에 저장하는 함수
  const fetchFestivalData = async () => {
    try {
      const rawData = await getFestivalData();                  // 원본 API 데이터 요청
      const simplified = simplifyFestivalData(rawData);         // 필요한 필드만 남긴 간단화 처리
      const sorted = sortBySeason(simplified);                  // 계절별로 축제를 분류

      setFestivalData({
        all: simplified,
        bySeason: sorted,
      });

      // 현재 월 기준으로 계절을 자동 설정 (앱 시작 시)
      setCurrentSeason(getSeason(new Date().getMonth() + 1));
    } catch (err) {
      console.error("❌ 축제 데이터 불러오기 실패:", err);
    } finally {
      setIsLoading(false); // 로딩 상태 해제
    }
  };

  // ✅ 컴포넌트 마운트 시 축제 데이터를 최초로 불러옴
  useEffect(() => {
    fetchFestivalData();
  }, []);

  // ✅ 축제 데이터 또는 계절이 바뀔 때마다 상위 자치구(topDistricts) 계산
  useEffect(() => {
    const top = calculateTopDistricts(festivalData, currentSeason);
    setTopDistricts(top);
  }, [festivalData, currentSeason]);

  return (
    // ✅ 부트스트랩 반응형 테마 적용 + Context Provider 설정
    <ThemeProvider breakpoints={['xxxl','xxl', 'xl', 'lg', 'md', 'sm', 'xs']} minBreakpoint="xxs">
      <FestivalContext.Provider value={{
        festivalData,          // 전체 및 계절별 축제 데이터
        isLoading,             // 로딩 여부
        currentSeason,         // 선택된 계절
        setCurrentSeason,      // 계절 변경 함수
        selectedDistrict,      // 선택된 자치구
        setSelectedDistrict,   // 자치구 변경 함수
        selectedFestival,      // 선택된 축제 정보
        setSelectedFestival,   // 축제 선택/해제 함수
        topDistricts,          // 상위 자치구 리스트
        setTopDistricts,       // 상위 자치구 설정 함수
        sidebarVisible,        // 사이드바 표시 여부
        setSidebarVisible      // 사이드바 열기/닫기 제어
      }}>

        {/* ✅ 라우팅 설정: 현재는 메인 페이지만 존재 */}
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/detail/:title" element={<DetailPage />}/>
          <Route path="*" element={<NotFoundPage />}/>
        </Routes>

      </FestivalContext.Provider>
    </ThemeProvider>
  );
}

export default App;