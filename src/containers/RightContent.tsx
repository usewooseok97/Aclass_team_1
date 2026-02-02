import { memo } from "react";
import { useGeolocation } from "@uidotdev/usehooks";
import { useFestivalContext } from "@hooks/useFestivalContext";
import { FestivalListContainer } from "@containers/FestivalListContainer";
import { TitleText } from "@atoms/TitleText";
import { ContentsText } from "@atoms/ContentsText";
import { GridPictures } from "@components/GridPictures";
import { LoadingState, ErrorState } from "@components/LoadingState";
import { BackButton } from "@atoms/BackButton";
import { FilterButtons } from "@components/FilterButtons";
import { TEXT_LIST } from "@constants/textConstants";

const RightContent = memo(() => {
  const {
    selectedDistrict,
    setSelectedDistrict,
    dateFilter,
    setDateFilter,
    showFavoritesOnly,
    setShowFavoritesOnly,
    sortBy,
    setSortBy,
    isLoading,
    error,
  } = useFestivalContext();

  const geolocation = useGeolocation();
  const isLocationAvailable = !!(geolocation.latitude && geolocation.longitude);

  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState message={error} />;
  }

  if (!selectedDistrict) {
    // Default view: Show original static content
    return (
      <>
        <TitleText text={TEXT_LIST.TITLE.MAIN} />
        <ContentsText text={TEXT_LIST.CONTENTS.INTRO} className="mt-12.5" />
        <GridPictures />
        <ContentsText text={TEXT_LIST.CONTENTS.FEATURES} className="mt-10" />
      </>
    );
  }

  // District selected: Show festival list
  return (
    <>
      <BackButton onClick={() => setSelectedDistrict(null)} className="mb-4" />
      <TitleText text={selectedDistrict} />

      {/* 필터 버튼들 */}
      <div className="mt-4 w-full">
        <FilterButtons
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
          sortBy={sortBy}
          onSortChange={setSortBy}
          isLocationAvailable={isLocationAvailable}
        />
      </div>

      <div className="mt-6 w-full">
        <FestivalListContainer />
      </div>
    </>
  );
});

RightContent.displayName = "RightContent";

export default RightContent;
