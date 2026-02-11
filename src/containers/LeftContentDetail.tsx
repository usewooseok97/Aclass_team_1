import { useFestivalContext } from "@/hooks/useFestivalContext";
import { CardLayout } from "@/atoms/CardLayout";
import { NearbyRestaurants } from "@/pages/FestivalDetailPage/NearbyRestaurants";
import { FestivalReviewSection } from "@/components/FestivalReviewSection";

const LeftContentDetail = () => {
  const { selectedFestival , nearbyPlaces } = useFestivalContext();

  if (!selectedFestival) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between w-full h-full overflow-y-auto scrollbar-hide">
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
