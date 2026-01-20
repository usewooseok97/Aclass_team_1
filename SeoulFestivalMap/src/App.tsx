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
import RightContent from "@containers/RightContent";
import LeftContent from "@containers/LeftContent";
 
function App() {
  const { phase } = useTimePhase();

  /**
   * 시간대(phase)에 따른 배경 그라데이션 반환
   * TimetoScrolling 컴포넌트와 동일한 그라데이션 사용
   *
   * @param phase - 현재 시간대 ('morning' | 'day' | 'sunset' | 'night')
   * @returns CSS linear-gradient 문자열
   */
  const getGradient = (phase: string): string => {
    switch (phase) {
      case 'morning':  // 아침 (06:00~09:00): 분홍 → 주황 → 노랑
        return 'linear-gradient(to right, #fda4af, #fdba74, #fef08a)';
      case 'day':      // 낮 (09:00~16:00): 하늘색 그라데이션
        return 'linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)';
      case 'sunset':   // 노을 (16:00~18:00): 주황 → 분홍 → 보라
        return 'linear-gradient(to right, #f97316, #db2777, #7c3aed)';
      case 'night':    // 밤 (18:00~06:00): 딥 네이비/보라
        return 'linear-gradient(to right, #1e1b4b, #312e81, #1e3a5f)';
      default:
        return 'linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)';
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
              <LeftContent />
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
