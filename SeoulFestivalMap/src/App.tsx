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
import WeatherLocation from "./Item/WeatherLocation";
import SearchInput from "./Item/SearchInput";
import img from "./assets/mainBackground.png"
import ChamgesButton from "./Item/ChamgesButton";
import FooterText from "./Item/FooterText";
import { FestivalProvider, useFestivalContext } from "./contexts/FestivalContext";
import FestivalList from "./Component/FestivalList";
import PlaceList from "./Component/PlaceList";

// Separate component to use Context inside Provider
const RightContent = () => {
  const { selectedDistrict, isLoading, error } = useFestivalContext();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
        <p className="text-gray-600">데이터를 불러오는 중...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <svg className="w-20 h-20 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-600 text-center font-semibold mb-2">데이터 로드 실패</p>
        <p className="text-gray-600 text-center text-sm">{error}</p>
      </div>
    );
  }

  if (!selectedDistrict) {
    // Default view: Show original static content
    return (
      <>
        <TitleText text={TEXT_LIST.TITLE.MAIN} />
        <ContentsText text={TEXT_LIST.CONTENTS.INTRO} className="mt-12.5" />
        <GridPictures />
        <ContentsText text={TEXT_LIST.CONTENTS.FEATURES} className="mt-10" />
        <Pictures backgroundImg={seoularea} />
      </>
    );
  }

  // District selected: Show festival list
  return (
    <>
      <TitleText text={selectedDistrict} />
      <ContentsText text={`${selectedDistrict}의 축제 정보`} className="mt-4" />
      <div className="mt-6 w-full">
        <FestivalList />
        <PlaceList />
      </div>
    </>
  );
};

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
        {/* 이미지 레이어 - 맨 뒤 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img})` }}
        />

        {/* Gradient 오버레이 - 이미지 위 */}
        <div
          className={`absolute inset-0 transition-colors duration-1000 ${getBackgroundClass(phase)} opacity-70`}
        />

        {/* 컨텐츠 - 맨 앞 */}
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
          <HeaderComponent>
            <WeatherLocation />
            <TimetoScrolling />
            <SearchInput />
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
              <RightContent />
            </RightCardComponent>
          </main>
          <FooterComponent>
            <ChamgesButton />
            <FooterText text={TEXT_LIST.FOOTER}/>
          </FooterComponent>
        </div>
      </div>
    </FestivalProvider>
  );
}

export default App;
