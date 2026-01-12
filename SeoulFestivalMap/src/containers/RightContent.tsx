import { useFestivalContext } from "@hooks/useFestivalContext";
import { FestivalListContainer } from "@containers/FestivalListContainer";
import { PlaceListContainer } from "@containers/PlaceListContainer";
import { TitleText } from "@atoms/TitleText";
import { ContentsText } from "@atoms/ContentsText";
import { Pictures } from "@atoms/Pictures";
import { GridPictures } from "@components/GridPictures";
import { TEXT_LIST } from "@constants/textConstants";
import seoularea from "@assets/seoularea.png";

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
        <svg
          className="w-20 h-20 text-red-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-600 text-center font-semibold mb-2">
          데이터 로드 실패
        </p>
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
        <FestivalListContainer />
        <PlaceListContainer />
      </div>
    </>
  );
};

export default RightContent