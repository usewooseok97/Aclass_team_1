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
import { FestivalProvider } from "@contexts/FestivalContext";
import { useFestivalContext } from "@hooks/useFestivalContext";
import RightContent from "@containers/RightContent";
import LeftContent from "@containers/LeftContent";
import LeftContentDetail from "./containers/LeftContentDetail";
import RightContentDetail from "./containers/RightContentDetail";
import { FestivalLocationMap } from "@pages/FestivalDetailPage/FestivalLocationMap";
import { FullWidthCard } from "@atoms/FullWidthCard";
import { getGradient, getThemeColors } from "@utils/theme";

const AppContent = () => {
  const { viewMode, selectedFestival } = useFestivalContext();
  const { phase } = useTimePhase();

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
            {viewMode === "detail" ? <LeftContentDetail /> : <LeftContent />}
          </LeftSectionContainer>
          <RightSectionContainer>
            {viewMode === "detail" ? <RightContentDetail /> : <RightContent />}
          </RightSectionContainer>
        </main>

        {/* 지도: 좌우 컨테이너 아래, 푸터 위 */}
        {viewMode === "detail" && selectedFestival && (
          <article className="w-full max-w-7xl mx-auto px-4 mb-4">
            <FullWidthCard>
              <div className="p-6">
                <FestivalLocationMap place={selectedFestival.PLACE} />
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
  return (
    <FestivalProvider>
      <AppContent />
    </FestivalProvider>
  );
}

export default App;
