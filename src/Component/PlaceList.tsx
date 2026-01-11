import { useFestivalContext } from '../contexts/FestivalContext';
import PlaceCard from '../Item/PlaceCard';

const PlaceList = () => {
  const { selectedFestival, nearbyPlaces } = useFestivalContext();

  // Don't show anything if no festival is selected
  if (!selectedFestival) {
    return null;
  }

  return (
    <div className="w-full mt-6">
      <div className="mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800">
          주변 맛집 · 카페
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedFestival.TITLE} 근처
        </p>
      </div>

      {nearbyPlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <p className="text-gray-500 text-center">
            주변 장소 정보가 없습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {nearbyPlaces.map((place, index) => (
            <PlaceCard
              key={`${place.name}-${index}`}
              place={place}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaceList;
