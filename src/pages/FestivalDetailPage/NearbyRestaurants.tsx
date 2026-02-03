import { Utensils } from "lucide-react";
import { RestaurantCard } from "@/components/RestaurantCard";
import type { Place, Festival } from "@/types/festival";

interface NearbyRestaurantsProps {
  places: Place[];
  festival: Festival | null;
}

export const NearbyRestaurants = ({ places, festival }: NearbyRestaurantsProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-base font-bold flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        <Utensils className="w-5 h-5" style={{ color: "var(--btn-primary)" }} />
        주변 맛집 (400m 이내)
      </h3>

      {places.length > 0 ? (
        <div className="flex flex-col gap-2">
          {places.map((place, index) => (
            <RestaurantCard key={index} place={place} festival={festival} />
          ))}
        </div>
      ) : (
        <p
          className="text-sm text-center py-4"
          style={{ color: "var(--text-secondary)" }}
        >
          400m 이내에 맛집 정보가 없습니다.
        </p>
      )}
    </div>
  );
};
