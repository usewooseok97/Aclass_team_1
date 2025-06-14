import { useState, createContext, useEffect } from "react";
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes, useLocation } from "react-router";
import MainPage from "./pages/MainPage";
import { getFestivalData } from "./services/axiosServices";
import { calculateTopDistricts, getSeason, simplifyAndSortFestivalData} from "./utilFunction/festivalUtils";
import NotFoundPage from "./pages/NotFound";
import DetailPage from "./pages/DetailPage";
import GalleryPage from "./pages/GalleryPage";

// ✅ 전역 상태 공유용 Context 생성
export const FestivalContext = createContext();

function App() {
  // ----------------------- ✅ 상태 정의 -----------------------

  // 🎉 축제 데이터 상태
  const [festivalData, setFestivalData] = useState({
    all: [],                                      // 전체 축제 데이터
    bySeason: { 봄: [], 여름: [], 가을: [], 겨울: [] }, // 계절별 축제 데이터
  });

  // 🔍 UI 상태
  const [isLoading, setIsLoading] = useState(true);         // 데이터 로딩 상태
  const [currentSeason, setCurrentSeason] = useState('');   // 현재 선택된 계절
  const [selectedDistrict, setSelectedDistrict] = useState(''); // 현재 선택된 자치구
  const [selectedFestival, setSelectedFestival] = useState(null); // 상세보기 중인 축제
  const [sidebarVisible, setSidebarVisible] = useState(false);   // 사이드바 표시 여부

  // 🏆 통계 상태
  const [topDistricts, setTopDistricts] = useState([]);      // 상위 평점 자치구

  // ❤️ 찜 기능 트리거 상태 (렌더링 유도용)
  const [favoriteTrigger, setFavoriteTrigger] = useState(0);
  // pathname 감지하는 함수
  const location = useLocation();

  // ----------------------- ✅ 찜 관련 로직 -----------------------

  const isFavorite = (title) => {
    return localStorage.getItem(title) !== null;
  };

  const toggleFavorite = (title) => {
    const exists = isFavorite(title);

    if (exists) {
      localStorage.removeItem(title);
    } else {
      localStorage.setItem(title, title); // key도 value도 TITLE
    }

    // 🔁 리렌더링 유도
    setFavoriteTrigger(prev => prev + 1);
  };

  // ----------------------- ✅ 데이터 요청 -----------------------

  const fetchFestivalData = async () => {
    try {
      const rawData = await getFestivalData();             // 원본 API 호출
    const { all, bySeason } = simplifyAndSortFestivalData(rawData);

    setFestivalData({ all, bySeason });

      // 현재 월에 해당하는 계절 자동 설정
      setCurrentSeason(getSeason(new Date().getMonth() + 1));
    } catch (err) {
      console.error("❌ 축제 데이터 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------- ✅ 사이드 효과 -----------------------

  useEffect(() => {
    fetchFestivalData(); // 앱 최초 실행 시 데이터 요청
  }, []);

  useEffect(() => {
    const top = calculateTopDistricts(festivalData, currentSeason);
    setTopDistricts(top); // 계절이 바뀔 때마다 top 3 구 갱신
  }, [festivalData, currentSeason]);
  useEffect(() => {

  },)


  // 🔽 pathname 바뀔 때마다 스크롤 맨 위로 이동
    useEffect(() => {
      window.scrollTo(0, 0); // 페이지 전환 시 항상 최상단으로 이동
    }, [location.pathname]);

  // ----------------------- ✅ 렌더링 -----------------------

  return (
    <ThemeProvider breakpoints={['xxxl','xxl', 'xl', 'lg', 'md', 'sm', 'xs']} minBreakpoint="xxs">
      <FestivalContext.Provider value={{
        // 🎉 축제 데이터
        festivalData,
        isLoading,
        // 🔍 UI 제어
        currentSeason,
        setCurrentSeason,
        selectedDistrict,
        setSelectedDistrict,
        selectedFestival,
        setSelectedFestival,
        sidebarVisible,
        setSidebarVisible,
        // 🏆 통계 데이터
        topDistricts,
        setTopDistricts,
        // ❤️ 찜 기능
        isFavorite,
        toggleFavorite,
        favoriteTrigger,
      }}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/detail/:title" element={<DetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </FestivalContext.Provider>
    </ThemeProvider>
  );
}

export default App;
