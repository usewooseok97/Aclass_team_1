import { memo } from "react";
import { useFestivalContext } from "@/hooks/useFestivalContext";
import { CardLayout } from "@/atoms/CardLayout";
import { SeoulMapContainer } from "@/containers/SeoulMapContainer";
import { SeasonButton } from "@/atoms/SeasonButton";
import { GridButtonGroup } from "@/components/GridButtonGroup";
import { BackButton } from "@/atoms/BackButton";
import { FestivalReviewSection } from "@/components/FestivalReviewSection";
import { calculateRating } from "@/utils/rating";
import { MapPin, Calendar, Utensils, Star } from "lucide-react";

const LeftContent = memo(() => {
  const { selectedFestival, setSelectedFestival, nearbyPlaces, navigateToDetail } = useFestivalContext();

  // 카드 클릭 안했으면 기존 지도/버튼 화면
  if (!selectedFestival) {
    return (
      <>
        <CardLayout>
          <SeoulMapContainer />
          <div className="order-first md:order-0 w-full">
            <SeasonButton />
          </div>
        </CardLayout>
        <CardLayout>
          <GridButtonGroup />
        </CardLayout>
      </>
    );
  }

  // 평점 계산
  const { rating, fullStars, hasHalfStar } = calculateRating(selectedFestival.buzz_score);

  // 대표 먹거리
  const representativePlace = nearbyPlaces.length > 0 ? nearbyPlaces[0] : null;

  return (
    <>
      <CardLayout>
        <div className="flex flex-col items-center justify-center p-12 w-full h-full overflow-y-auto scrollbar-hide">
          <BackButton onClick={() => setSelectedFestival(null)} className="mb-3" />
          {/* 축제 이미지 - 클릭 시 상세 페이지로 이동 */}
          <button
            onClick={() => navigateToDetail(selectedFestival)}
            className="w-full h-48 rounded-lg overflow-hidden mb-4 cursor-pointer"
          >
            <img
              src={selectedFestival.MAIN_IMG}
              alt={selectedFestival.TITLE}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>

          {/* 제목 + 평점 */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              {selectedFestival.TITLE}
            </h2>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>({rating})</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < fullStars
                      ? "text-yellow-400 fill-yellow-400"
                      : i === fullStars && hasHalfStar
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 정보 리스트 */}
          <div className="flex flex-col gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--btn-primary)' }} />
              <span>위치 : {selectedFestival.PLACE}</span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--btn-primary)' }} />
              <span>기간 : {selectedFestival.DATE}</span>
            </div>
            {representativePlace && (
              <div className="flex items-start gap-2">
                <Utensils className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--btn-primary)' }} />
                <span>대표 먹거리 : {representativePlace.name}</span>
              </div>
            )}
          </div>

          {/* 설명 */}
          <div className="mt-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <p className="line-clamp-4">{selectedFestival.PROGRAM}</p>
          </div>

          {/* 상세 페이지 버튼 */}
          <button
            onClick={() => navigateToDetail(selectedFestival)}
            className="mt-4 text-right text-sm hover:underline w-full"
            style={{ color: 'var(--btn-primary)' }}
          >
            상세 페이지 &gt;
          </button>
        </div>
      </CardLayout>

      {/* 칠판 댓글 카드 */}
      <CardLayout>
        <FestivalReviewSection festivalId={selectedFestival.TITLE} readOnly />
      </CardLayout>
    </>
  );
});

LeftContent.displayName = "LeftContent";

export default LeftContent;
