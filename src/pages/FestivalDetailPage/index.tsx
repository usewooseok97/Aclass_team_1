import { useFestivalContext } from "@hooks/useFestivalContext";
import { CardLayout } from "@atoms/CardLayout";
import { FestivalDetailHeader } from "./FestivalDetailHeader";
import { FestivalImageGallery } from "./FestivalImageGallery";
import { FestivalBasicInfo } from "./FestivalBasicInfo";
import { FestivalDescription } from "./FestivalDescription";
import { NearbyRestaurants } from "./NearbyRestaurants";
import { FestivalDetailInfo } from "./FestivalDetailInfo";
import { FestivalActionButtons } from "./FestivalActionButtons";
import { FestivalLocationMap } from "./FestivalLocationMap";

export const FestivalDetailPage = () => {
  const { selectedFestival, nearbyPlaces, navigateBack } = useFestivalContext();

  if (!selectedFestival) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6">
      <CardLayout>
        <div className="p-6">
          <FestivalDetailHeader
            festival={selectedFestival}
            onBack={navigateBack}
          />
        </div>
      </CardLayout>

      <CardLayout>
        <div className="p-6 flex flex-col gap-6">
          <FestivalImageGallery
            mainImage={selectedFestival.MAIN_IMG}
            title={selectedFestival.TITLE}
          />
          <FestivalBasicInfo festival={selectedFestival} />
        </div>
      </CardLayout>

      <CardLayout>
        <div className="p-6">
          <FestivalDescription program={selectedFestival.PROGRAM} />
        </div>
      </CardLayout>

      <CardLayout>
        <div className="p-6">
          <NearbyRestaurants places={nearbyPlaces} />
        </div>
      </CardLayout>

      <CardLayout>
        <div className="p-6">
          <FestivalDetailInfo festival={selectedFestival} />
          <FestivalActionButtons homepageUrl={selectedFestival.HMPG_ADDR} />
        </div>
      </CardLayout>

      <CardLayout>
        <div className="p-6">
          <FestivalLocationMap place={selectedFestival.PLACE} />
        </div>
      </CardLayout>
    </div>
  );
};
