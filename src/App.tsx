import LeftCardComponent from "./Component/LeftCardComponent";
import LeftCardContainer from "./Component/LeftCardContainer";
import MainContainer from "./Component/MainContainer";
import RightCardComponent from "./Component/RightCardComponent";
import SeoulMap from "./Item/SeoulMap";
import SeasonButton from "./Item/SeasonButton";

function App() {
  return (
    <MainContainer>
      <LeftCardContainer>
        <LeftCardComponent>
          <SeoulMap />
          <SeasonButton />
        </LeftCardComponent>
        <LeftCardComponent>
          
        </LeftCardComponent>
      </LeftCardContainer>
      <RightCardComponent>
        <h1>dd</h1>
      </RightCardComponent>
    </MainContainer>
  );
}

export default App;
