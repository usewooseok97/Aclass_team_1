import { useState } from "react";
import { Star } from "lucide-react";
import { Badge } from "@atoms/Badge";
import type { Place } from "@/types/festival";
import { getPhotoUrl, getCategoryImage } from "@/utils/googlePlaces";

interface RestaurantCardProps {
  place: Place;
}

const getCategoryVariant = (category: string) => {
  if (category.includes("한식")) return "orange";
  if (category.includes("카페") || category.includes("커피")) return "purple";
  if (category.includes("양식") || category.includes("이탈리안")) return "blue";
  if (category.includes("중식")) return "pink";
  if (category.includes("일식")) return "green";
  return "default";
};

export const RestaurantCard = ({ place }: RestaurantCardProps) => {
  const rating = (Math.random() * 1 + 4).toFixed(1);
  const [imageError, setImageError] = useState(false);

  // Google Places 사진 URL 또는 카테고리 기본 이미지
  const photoUrl = place.photos?.[0]?.name
    ? getPhotoUrl(place.photos[0].name, 200)
    : "";
  const fallbackImage = getCategoryImage(place.category);
  const imageSource = !imageError && photoUrl ? photoUrl : fallbackImage;

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        borderWidth: "1px",
      }}
    >
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 shrink-0">
        {imageSource ? (
          <img
            src={imageSource}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-2xl"
            style={{ backgroundColor: "var(--card-border)" }}
          >
            🍽️
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-medium truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {place.name}
          </span>
          <Badge
            text={place.category.split(">").pop()?.trim() || place.category}
            variant={getCategoryVariant(place.category)}
          />
        </div>

        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {rating}
          </span>
        </div>

        {place.telephone && (
          <p
            className="text-xs mt-1 truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {place.telephone}
          </p>
        )}
      </div>
    </div>
  );
};
