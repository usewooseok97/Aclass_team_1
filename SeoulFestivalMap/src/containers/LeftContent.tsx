import { useFestivalContext } from "@hooks/useFestivalContext";
import { CardLayout } from "@atoms/CardLayout";
import { SeoulMapContainer } from "@containers/SeoulMapContainer";
import { SeasonButton } from "@atoms/SeasonButton";
import { GridButtonGroup } from "@components/GridButtonGroup";

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
            <h2 className="text-lg font-bold text-black">
              {selectedFestival.TITLE}
            </h2>
            <span className="text-sm text-gray-500">({rating})</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < fullStars
                      ? "text-yellow-400"
                      : i === fullStars && hasHalfStar
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* 정보 리스트 */}
          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <span className="text-purple-600">📍</span>
              <span>위치 : {selectedFestival.PLACE}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600">📅</span>
              <span>기간 : {selectedFestival.DATE}</span>
            </div>
            {representativePlace && (
              <div className="flex items-start gap-2">
                <span className="text-purple-600">🍽</span>
                <span>대표 먹거리 : {representativePlace.name}</span>
              </div>
            )}
          </div>

          {/* 설명 */}
          <div className="mt-4 text-sm text-gray-600 leading-relaxed">
            <p className="line-clamp-4">{selectedFestival.PROGRAM}</p>
          </div>

          {/* 상세 페이지 링크 */}
          {selectedFestival.HMPG_ADDR && (
            <a
              href={selectedFestival.HMPG_ADDR}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-right text-sm text-purple-600 hover:underline"
            >
              상세 페이지 &gt;
            </a>
          )}
        </div>
      </CardLayout>

      {/* 주변 먹거리 카드 */}
      <CardLayout>
        <div className="flex flex-col p-4 w-full">
          <h3 className="text-lg font-bold text-black mb-4">🍽 주변 먹거리</h3>
          {nearbyPlaces.length > 0 ? (
            <div className="flex flex-col gap-3">
              {nearbyPlaces.map((place, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-black">{place.name}</span>
                    <span className="text-xs text-gray-500">{place.category}</span>
                  </div>
                  {place.telephone && (
                    <span className="text-xs text-gray-400">{place.telephone}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              주변 먹거리 정보가 없습니다.
            </p>
          )}
        </div>
      </CardLayout>
    </>
  );
};

export default LeftContent;
