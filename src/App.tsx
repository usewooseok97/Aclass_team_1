import { lazy, Suspense, useState, useEffect } from "react";
import { LeftSectionContainer } from "@/containers/LeftSectionContainer";
import { RightSectionContainer } from "@/containers/RightSectionContainer";
import { BackgroundContainer } from "@/containers/BackgroundContainer";
import { HeaderContainer } from "@/containers/HeaderContainer";
import { FooterContainer } from "@/containers/FooterContainer";
import { TEXT_LIST } from "@/constants/textConstants";
import { TimetoScrolling } from "@/components/TimetoScrolling";
import { WeatherLocation } from "@/components/WeatherLocation";
import { SearchInput } from "@/components/SearchInput";
import { AuthButton } from "@/components/AuthButton";
import { AuthModal } from "@/components/AuthModal";
import { MobileTabBar, type MobileTab } from "@/components/MobileTabBar";
import { LanguageButton } from "@/atoms/LanguageButton";
import { FooterText } from "@/atoms/FooterText";
import { useFestivalContext } from "@/hooks/useFestivalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useUrlSync } from "@/hooks/useUrlSync";
import RightContent from "@/containers/RightContent";
import LeftContent from "@/containers/LeftContent";
import { FullWidthCard } from "@/atoms/FullWidthCard";
import { LoadingState } from "@/components/LoadingState";
import { NotFoundPage } from "@/pages/NotFoundPage/NotFoundPage";

// 코드 스플리팅: 상세 페이지 컴포넌트 지연 로딩
const LeftContentDetail = lazy(() => import("./containers/LeftContentDetail"));
const RightContentDetail = lazy(() => import("./containers/RightContentDetail"));
const FestivalLocationMap = lazy(() =>
  import("@/pages/FestivalDetailPage/FestivalLocationMap").then((m) => ({
    default: m.FestivalLocationMap,
  }))
);

const AppContent = () => {
  const { viewMode, selectedFestival, selectedDistrict } = useFestivalContext();
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [mobileTab, setMobileTab] = useState<MobileTab>("map");

  // URL 동기화
  useUrlSync();

  // 구 선택 시 자동으로 목록 탭 전환
  useEffect(() => {
    if (selectedDistrict) {
      setMobileTab("list");
    }
  }, [selectedDistrict]);

  // 404 페이지는 별도 레이아웃
  if (viewMode === "notfound") {
    return <NotFoundPage />;
  }

  const isDetail = viewMode === "detail";

  return (
    <BackgroundContainer>
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        <HeaderContainer backgroundElement={<TimetoScrolling />}>
          <WeatherLocation />
          <SearchInput />
          <AuthButton />
        </HeaderContainer>

        {/* 모바일 탭 바 (detail 모드 제외) */}
        {!isDetail && (
          <MobileTabBar activeTab={mobileTab} onTabChange={setMobileTab} />
        )}

        <main className="flex flex-col md:flex-row md:flex-wrap justify-center gap-4 md:gap-20 w-full">
          {/* 왼쪽: 지도 영역 */}
          <LeftSectionContainer
            className={`${
              isDetail || mobileTab === "map" ? "flex" : "hidden"
            } md:flex ${isDetail ? "order-2 md:order-1" : ""}`}
          >
            {isDetail ? (
              <Suspense fallback={<LoadingState />}>
                <LeftContentDetail />
              </Suspense>
            ) : (
              <LeftContent />
            )}
          </LeftSectionContainer>

          {/* 오른쪽: 목록 영역 */}
          <RightSectionContainer
            className={`${
              isDetail || mobileTab === "list" ? "flex" : "hidden"
            } md:flex ${isDetail ? "order-1 md:order-2" : ""}`}
          >
            {isDetail ? (
              <Suspense fallback={<LoadingState />}>
                <RightContentDetail />
              </Suspense>
            ) : (
              <RightContent />
            )}
          </RightSectionContainer>
        </main>

        {/* 지도: 좌우 컨테이너 아래, 푸터 위 */}
        {isDetail && selectedFestival && (
          <article className="w-full max-w-7xl mt-4 md:mt-10 mx-auto px-4 mb-4">
            <FullWidthCard>
              <div className="p-4 md:p-6">
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

      {/* 전역 로그인 모달 */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </BackgroundContainer>
  );
};

function App() {
  return <AppContent />;
}

export default App;
