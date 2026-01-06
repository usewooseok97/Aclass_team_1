import LeftCardComponent from "./Component/LeftCardComponent";
import LeftCardContainer from "./Component/LeftCardContainer";
import RightCardComponent from "./Component/RightCardComponent";
import SeoulMap from "./Item/SeoulMap";
import SeasonButton from "./Item/SeasonButton";
import GridButtonContainer from "./Component/GridButtonContainer";
import HeaderComponent from "./Component/HeaderComponent";
import FooterComponent from "./Component/FooterComponent";

function App() {
  return (
    <body className="max-w-7xl mx-auto flex flex-col">
      <HeaderComponent>
        <h2>dd</h2>
        <h2>dd</h2>
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
          <h1>dd</h1>
        </RightCardComponent>
      </main>
      <FooterComponent>
        <h2>dd</h2>
        <h2>dd</h2>
      </FooterComponent>
    </body>
  );
}

export default App;
