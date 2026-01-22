import { Utensils } from "lucide-react";
import { RestaurantCard } from "@components/RestaurantCard";
import type { Place } from "@/types/festival";

interface NearbyRestaurantsProps {
  places: Place[];
}

export const NearbyRestaurants = ({ places }: NearbyRestaurantsProps) => {
  const displayPlaces = places.slice(0, 4);

  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-base font-bold flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        <Utensils className="w-5 h-5" style={{ color: "var(--btn-primary)" }} />
        주변 맛집
      </h3>

      {displayPlaces.length > 0 ? (
        <div className="flex flex-col gap-2">
          {displayPlaces.map((place, index) => (
            <RestaurantCard key={index} place={place} />
          ))}
          {places.length > 4 && (
            <button
              className="w-full py-2 text-sm rounded-lg border transition-colors"
              style={{
                borderColor: "var(--card-border)",
                color: "var(--text-secondary)",
              }}
            >
              더 많은 맛집 보기
            </button>
          )}
        </div>
      ) : (
        <p
          className="text-sm text-center py-4"
          style={{ color: "var(--text-secondary)" }}
        >
          주변 맛집 정보가 없습니다.
        </p>
      )}
    </div>
  );
};
