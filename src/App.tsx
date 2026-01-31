import { lazy, Suspense } from "react";
import { LeftSectionContainer } from "@containers/LeftSectionContainer";
import { RightSectionContainer } from "@containers/RightSectionContainer";
import { HeaderContainer } from "@containers/HeaderContainer";
import { FooterContainer } from "@containers/FooterContainer";
import { TEXT_LIST } from "@constants/textConstants";
import { TimetoScrolling } from "@components/TimetoScrolling";
import { useTimePhase } from "@hooks/useTimePhase";
import { WeatherLocation } from "@components/WeatherLocation";
import { SearchInput } from "@components/SearchInput";
import img from "@assets/mainBackground.png";
import { LanguageButton } from "@atoms/LanguageButton";
import { FooterText } from "@atoms/FooterText";
import { useFestivalContext } from "@hooks/useFestivalContext";
import { useUrlSync } from "@hooks/useUrlSync";
import RightContent from "@containers/RightContent";
import LeftContent from "@containers/LeftContent";
import { FullWidthCard } from "@atoms/FullWidthCard";
import { getGradient, getThemeColors } from "@utils/theme";
import { LoadingState } from "@components/LoadingState";
import { NotFoundPage } from "@pages/NotFoundPage/NotFoundPage";

// 코드 스플리팅: 상세 페이지 컴포넌트 지연 로딩
const LeftContentDetail = lazy(() => import("./containers/LeftContentDetail"));
const RightContentDetail = lazy(() => import("./containers/RightContentDetail"));
const FestivalLocationMap = lazy(() =>
  import("@pages/FestivalDetailPage/FestivalLocationMap").then((m) => ({
    default: m.FestivalLocationMap,
  }))
);

const AppContent = () => {
  const { viewMode, selectedFestival } = useFestivalContext();
  const { phase } = useTimePhase();

  // URL 동기화
  useUrlSync();

  // 404 페이지는 별도 레이아웃
  if (viewMode === "notfound") {
    return <NotFoundPage />;
  }

  return (
    <div className="relative w-full min-h-screen" style={getThemeColors(phase)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: getGradient(phase) }}
      />
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        <HeaderContainer backgroundElement={<TimetoScrolling />}>
          <WeatherLocation />
          <SearchInput />
        </HeaderContainer>
        <main className="flex flex-row flex-wrap justify-center gap-20 w-full">
          <LeftSectionContainer>
            {viewMode === "detail" ? (
              <Suspense fallback={<LoadingState />}>
                <LeftContentDetail />
              </Suspense>
            ) : (
              <LeftContent />
            )}
          </LeftSectionContainer>
          <RightSectionContainer>
            {viewMode === "detail" ? (
              <Suspense fallback={<LoadingState />}>
                <RightContentDetail />
              </Suspense>
            ) : (
              <RightContent />
            )}
          </RightSectionContainer>
        </main>

        {/* 지도: 좌우 컨테이너 아래, 푸터 위 */}
        {viewMode === "detail" && selectedFestival && (
          <article className="w-full max-w-7xl mt-10 mx-auto px-4 mb-4">
            <FullWidthCard>
              <div className="p-6">
                <Suspense fallback={<LoadingState />}>
                  <FestivalLocationMap />
                </Suspense>
              </div>
            </FullWidthCard>
          </article>
        )}

        <FooterContainer>
          <LanguageButton />
          <FooterText text={TEXT_LIST.FOOTER} />
        </FooterContainer>
      </div>
    </div>
  );
};

function App() {
  return <AppContent />;
}

export default App;
