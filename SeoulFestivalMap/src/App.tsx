import LeftCardComponent from "./Component/LeftCardComponent";
import LeftCardContainer from "./Component/LeftCardContainer";
import MainContainer from "./Component/MainContainer";
import RightCardComponent from "./Component/RightCardComponent";

function App() {
  return (
    <MainContainer>
      <LeftCardContainer>
        <LeftCardComponent>
          <h1>dd</h1>
        </LeftCardComponent>
        <LeftCardComponent>
          <h1>dd</h1>
        </LeftCardComponent>
      </LeftCardContainer>
      <RightCardComponent>
        <h1>dd</h1>
      </RightCardComponent>
    </MainContainer>
  );
}

export default App;
