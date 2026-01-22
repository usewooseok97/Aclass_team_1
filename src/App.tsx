import { LeftSectionContainer } from "@containers/LeftSectionContainer";
import { RightSectionContainer } from "@containers/RightSectionContainer";
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
import { useFestivalContext } from "@hooks/useFestivalContext";
import RightContent from "@containers/RightContent";
import LeftContent from "@containers/LeftContent";
import { FestivalDetailPage } from "@pages/FestivalDetailPage";
 
const getGradient = (phase: string): string => {
  switch (phase) {
    case 'morning':
      return 'linear-gradient(to right, #fda4af, #fdba74, #fef08a)';
    case 'day':
      return 'linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)';
    case 'sunset':
      return 'linear-gradient(to right, #f97316, #db2777, #7c3aed)';
    case 'night':
      return 'linear-gradient(to right, #1e1b4b, #312e81, #1e3a5f)';
    default:
      return 'linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)';
  }
};

const getThemeColors = (phase: string): React.CSSProperties => ({
  '--text-primary': phase === 'night' ? '#f1f5f9' : phase === 'sunset' ? '#581c87' : '#1e293b',
  '--text-secondary': phase === 'night' ? '#94a3b8' : phase === 'sunset' ? '#a855f7' : '#64748b',
  '--btn-primary': phase === 'morning' ? '#f97316' : phase === 'night' ? '#818cf8' : phase === 'sunset' ? '#7c3aed' : '#6750A4',
  '--btn-hover': phase === 'morning' ? '#ea580c' : phase === 'night' ? '#6366f1' : phase === 'sunset' ? '#6d28d9' : '#5b3f9a',
  '--card-bg': phase === 'night' ? 'rgba(30,27,75,0.7)' : 'rgba(255,255,255,0.85)',
  '--card-border': phase === 'morning' ? '#fdba74' : phase === 'night' ? '#4c1d95' : phase === 'sunset' ? '#c084fc' : '#93c5fd',
} as React.CSSProperties);

const MainContent = () => {
  const { viewMode } = useFestivalContext();

  if (viewMode === 'detail') {
    return <FestivalDetailPage />;
  }

  return (
    <main className="flex flex-row flex-wrap justify-center gap-20 w-full">
      <LeftSectionContainer>
        <LeftContent />
      </LeftSectionContainer>
      <RightSectionContainer>
        <RightContent />
      </RightSectionContainer>
    </main>
  );
};

function App() {
  const { phase } = useTimePhase();

  return (
    <FestivalProvider>
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
          <MainContent />
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
