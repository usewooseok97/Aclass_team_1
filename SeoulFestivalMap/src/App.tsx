import LeftCardComponent from "./Component/LeftCardComponent";
import LeftCardContainer from "./Component/LeftCardContainer";
import RightCardComponent from "./Component/RightCardComponent";
import SeoulMap from "./Item/SeoulMap";
import SeasonButton from "./Item/SeasonButton";
import GridButtonContainer from "./Component/GridButtonContainer";
import HeaderComponent from "./Component/HeaderComponent";
import FooterComponent from "./Component/FooterComponent";
import TitleText from "./Item/TitleText";
import ContentsText from "./Item/ContentsText";
import Pictures from "./Item/Pictures";
import GridPictures from "./Component/GridPictures";
import seoularea from './assets/seoularea.png';
import { TEXT_LIST } from "./Constants/textConstants";
import TimetoScrolling from "./Item/TimetoScrolling";
import { useTimePhase } from './hooks/useTimePhase';

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
    <div className={`max-w-7xl mx-auto flex flex-col transition-colors duration-1000 ${getBackgroundClass(phase)}`}>
      <HeaderComponent>
        <h2>dd</h2>
        <TimetoScrolling />
        <h2>dd</h2>
      </HeaderComponent>
      <main className="flex flex-row flex-wrap justify-center gap-20 w-full">
        <LeftCardContainer>
          <LeftCardComponent>
            <SeoulMap />
            <SeasonButton />
          </LeftCardComponent>
          <LeftCardComponent>
            <GridButtonContainer />
          </LeftCardComponent>
        </LeftCardContainer>
        <RightCardComponent>
          <TitleText text={TEXT_LIST.TITLE.MAIN} />
          <ContentsText text={TEXT_LIST.CONTENTS.INTRO} className="mt-12.5" />
          <GridPictures />
          <ContentsText text={TEXT_LIST.CONTENTS.FEATURES} className="mt-10" />
          <Pictures backgroundImg={seoularea} />
        </RightCardComponent>
      </main>
      <FooterComponent>
        <h2>dd</h2>
        <h2>dd</h2>
      </FooterComponent>
    </div>
  );
}

export default App;
