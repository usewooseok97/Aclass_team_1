import { useFestivalContext } from "@/hooks/useFestivalContext";
import { CardLayout } from "@/atoms/CardLayout";
import { FestivalDetailInfo } from "@/pages/FestivalDetailPage/FestivalDetailInfo";
import { FestivalDescription } from "@/pages/FestivalDetailPage/FestivalDescription";
import { FestivalActionButtons } from "@/pages/FestivalDetailPage/FestivalActionButtons";
import { NearbyRestaurants } from "@/pages/FestivalDetailPage/NearbyRestaurants";
import { FestivalReviewSection } from "@/components/FestivalReviewSection";

const LeftContentDetail = () => {
  const { selectedFestival , nearbyPlaces } = useFestivalContext();

  if (!selectedFestival) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between w-full h-full overflow-y-auto scrollbar-hide">
      {/* 상세 정보 */}
      <CardLayout>
        <div className="p-4 w-full">
          <FestivalDetailInfo festival={selectedFestival} />
        </div>
        <div className="p-4 w-full">
          <FestivalDescription program={selectedFestival.PROGRAM} />
          <FestivalActionButtons homepageUrl={selectedFestival.HMPG_ADDR} />
        </div>
      </CardLayout>

      {/* 축제 리뷰 */}
      <FestivalReviewSection
        festivalId={selectedFestival.TITLE}
        festivalEndDate={selectedFestival.END_DATE}
      />

      {/* 주변 맛집 */}
      <CardLayout>
        <div className="p-4 w-full">
          <NearbyRestaurants places={nearbyPlaces} festival={selectedFestival} />
        </div>
      </CardLayout>
    </div>
  );
};

export default LeftContentDetail;
