import LeftCardComponent from "./Component/LeftCardComponent";
import LeftCardContainer from "./Component/LeftCardContainer";
import MainContainer from "./Component/MainContainer";
import RightCardComponent from "./Component/RightCardComponent";
import SeoulMap from "./Item/SeoulMap";
import SeasonButton from "./Item/SeasonButton";
import GridButtonContainer from "./Component/GridButtonContainer";
import HeaderComponent from "./Component/HeaderComponent";

function App() {
  return (
    <MainContainer>
      <HeaderComponent>
        <h2>dd</h2>
      </HeaderComponent>
      <div className="flex flex-row justify-between w-full">
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
          <h1>dd</h1>
        </RightCardComponent>
      </div>
    </MainContainer>
  );
}

export default App;
