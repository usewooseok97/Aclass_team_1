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

function App() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col">
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
