import { CardLayout } from "@atoms/CardLayout";
import { LeftSectionContainer } from "@containers/LeftSectionContainer";
import { RightSectionContainer } from "@containers/RightSectionContainer";
import { SeoulMapContainer } from "@containers/SeoulMapContainer";
import { SeasonButton } from "@atoms/SeasonButton";
import { GridButtonGroup } from "@components/GridButtonGroup";
import { HeaderContainer } from "@containers/HeaderContainer";
import { FooterContainer } from "@containers/FooterContainer";
import { TEXT_LIST } from "@constants/textConstants";
import { TimetoScrolling } from "@components/TimetoScrolling";
import { useTimePhase } from '@hooks/useTimePhase';
import { WeatherLocation } from "@components/WeatherLocation";
import { SearchInput } from "@components/SearchInput";
import img from "@assets/mainBackground.png"
import { LanguageButton } from "@atoms/LanguageButton";
import { FooterText } from "@atoms/FooterText";
import { FestivalProvider } from "@contexts/FestivalContext";
import RightContent from "@containers/RightContent";
 
function App() {
  const { phase } = useTimePhase();

  const getBackgroundClass = (phase: string): string => {
    switch (phase) {
      case 'day':
        return 'bg-gradient-to-b from-sky-100 to-sky-50';
      case 'sunset':
        return 'bg-gradient-to-b from-orange-100 to-pink-50';
      case 'night':
        return 'bg-gradient-to-b from-indigo-950 to-purple-950 text-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <FestivalProvider>
      <div className="relative w-full min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        />
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${getBackgroundClass(phase)} opacity-70`}
        />
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
          <HeaderContainer>
            <WeatherLocation />
            <TimetoScrolling />
            <SearchInput />
          </HeaderContainer>
          <main className="flex flex-row flex-wrap justify-center gap-20 w-full">
            <LeftSectionContainer>
              <CardLayout>
                <SeoulMapContainer />
                <SeasonButton />
              </CardLayout>
              <CardLayout>
                <GridButtonGroup />
              </CardLayout>
            </LeftSectionContainer>
            <RightSectionContainer>
              <RightContent />
            </RightSectionContainer>
          </main>
          <FooterContainer>
            <LanguageButton />
            <FooterText text={TEXT_LIST.FOOTER}/>
          </FooterContainer>
        </div>
      </div>
    </FestivalProvider>
  );
}

export default App;
