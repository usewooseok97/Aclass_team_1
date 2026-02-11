import { useFestivalContext } from "@/hooks/useFestivalContext";
import { BackButton } from "@/atoms/BackButton";
import { Badge } from "@/atoms/Badge";
import { StarRating } from "@/atoms/StarRating";
import { FestivalImageGallery } from "@/pages/FestivalDetailPage/FestivalImageGallery";
import { FestivalBasicInfo } from "@/pages/FestivalDetailPage/FestivalBasicInfo";
import { FestivalDetailInfo } from "@/pages/FestivalDetailPage/FestivalDetailInfo";
import { FestivalDescription } from "@/pages/FestivalDetailPage/FestivalDescription";
import { FestivalActionButtons } from "@/pages/FestivalDetailPage/FestivalActionButtons";

const RightContentDetail = () => {
  const { selectedFestival , navigateBack } = useFestivalContext();

  if (!selectedFestival) {
    return null;
  }

  const rating = selectedFestival.buzz_score / 20;
  const reviewCount = Math.floor(selectedFestival.buzz_score * 10);

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4 overflow-y-auto scrollbar-hide">
      {/* 헤더: 뒤로가기 + 뱃지 + 제목 + 별점 */}
      <div className="flex flex-col gap-3">
        <BackButton onClick={navigateBack} />

        <div className="flex items-center gap-2">
          <Badge text="축제" variant="pink" />
          <Badge text={selectedFestival.GUNAME} variant="purple" />
        </div>

        <h1
          className="text-xl font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          {selectedFestival.TITLE}
        </h1>

        <div className="flex items-center gap-2">
          <StarRating rating={rating} showNumber={true} size="md" />
          <span
            className="text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            ({reviewCount.toLocaleString()}개의 리뷰)
          </span>
        </div>
      </div>

      {/* 이미지 + 기본 정보 */}
        <div className="p-4 flex flex-col gap-4 w-full">
          <FestivalImageGallery
            mainImage={selectedFestival.MAIN_IMG}
            title={selectedFestival.TITLE}
          />
          <FestivalBasicInfo festival={selectedFestival} />
          <FestivalDetailInfo festival={selectedFestival} />
          <FestivalDescription program={selectedFestival.PROGRAM} />
          <FestivalActionButtons homepageUrl={selectedFestival.HMPG_ADDR} />
        </div>
    </div>
  );
};

export default RightContentDetail;
