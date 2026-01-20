import { useFestivalContext } from "@hooks/useFestivalContext";
import { CardLayout } from "@atoms/CardLayout";
import { SeoulMapContainer } from "@containers/SeoulMapContainer";
import { SeasonButton } from "@atoms/SeasonButton";
import { GridButtonGroup } from "@components/GridButtonGroup";
import { MapPin, Calendar, Utensils, Star } from "lucide-react";

const LeftContent = () => {
  const { selectedFestival, nearbyPlaces } = useFestivalContext();

  // 카드 클릭 안했으면 기존 지도/버튼 화면
  if (!selectedFestival) {
    return (
      <>
        <CardLayout>
          <SeoulMapContainer />
          <SeasonButton />
        </CardLayout>
        <CardLayout>
          <GridButtonGroup />
        </CardLayout>
      </>
    );
  }

  // 평점 계산
  const rating = (selectedFestival.buzz_score / 20).toFixed(1);
  const fullStars = Math.floor(Number(rating));
  const hasHalfStar = Number(rating) - fullStars >= 0.5;

  // 대표 먹거리
  const representativePlace = nearbyPlaces.length > 0 ? nearbyPlaces[0] : null;

  return (
    <>
      <CardLayout>
        <div className="flex flex-col p-4">
          {/* 축제 이미지 */}
          <div className="w-full h-48 rounded-lg overflow-hidden mb-4">
            <img
              src={selectedFestival.MAIN_IMG}
              alt={selectedFestival.TITLE}
              className="w-full h-full object-cover"
            />
          </div>

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

          {/* 상세 페이지 링크 */}
          {selectedFestival.HMPG_ADDR && (
            <a
              href={selectedFestival.HMPG_ADDR}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-right text-sm hover:underline"
              style={{ color: 'var(--btn-primary)' }}
            >
              상세 페이지 &gt;
            </a>
          )}
        </div>
      </CardLayout>

      {/* 주변 먹거리 카드 */}
      <CardLayout>
        <div className="flex flex-col p-4 w-full">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Utensils className="w-5 h-5" style={{ color: 'var(--btn-primary)' }} />
            주변 먹거리
          </h3>
          {nearbyPlaces.length > 0 ? (
            <div className="flex flex-col gap-3">
              {nearbyPlaces.map((place, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px' }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{place.name}</span>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{place.category}</span>
                  </div>
                  {place.telephone && (
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{place.telephone}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
              주변 먹거리 정보가 없습니다.
            </p>
          )}
        </div>
      </CardLayout>
    </>
  );
};

export default LeftContent;
