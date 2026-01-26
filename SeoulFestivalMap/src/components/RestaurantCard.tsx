import { memo, useState } from "react";
import { Navigation } from "lucide-react";
import { Badge } from "@atoms/Badge";
import type { Place, Festival } from "@/types/festival";
import { getPhotoUrl, getCategoryImage } from "@/utils/googlePlaces";
import { getNaverMapDirectionsUrl } from "@/utils/naverMap";

interface RestaurantCardProps {
  place: Place;
  festival?: Festival | null;
}

const getCategoryVariant = (category: string) => {
  if (category.includes("한식")) return "orange";
  if (category.includes("카페") || category.includes("커피")) return "purple";
  if (category.includes("양식") || category.includes("이탈리안")) return "blue";
  if (category.includes("중식")) return "pink";
  if (category.includes("일식")) return "green";
  return "default";
};

export const RestaurantCard = memo(({ place, festival }: RestaurantCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Google Places 사진 URL 또는 카테고리 기본 이미지
  const photoUrl = place.photos?.[0]?.name
    ? getPhotoUrl(place.photos[0].name, 200)
    : "";
  const fallbackImage = getCategoryImage(place.category);
  const imageSource = !imageError && photoUrl ? photoUrl : fallbackImage;

  // 길찾기 URL 생성 (축제 좌표가 있을 때만)
  const directionsUrl =
    festival?.mapx && festival?.mapy && place.mapx && place.mapy
      ? getNaverMapDirectionsUrl(
          festival.PLACE,
          festival.mapx,
          festival.mapy,
          place.name,
          place.mapx,
          place.mapy
        )
      : null;

  const CardWrapper = directionsUrl ? "a" : "div";
  const wrapperProps = directionsUrl
    ? {
        href: directionsUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className="flex items-start gap-3 p-3 rounded-lg hover:opacity-90 transition-opacity"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        borderWidth: "1px",
        cursor: directionsUrl ? "pointer" : "default",
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

        {place.telephone && (
          <p
            className="text-xs mt-1 truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            {place.telephone}
          </p>
        )}

        {directionsUrl && (
          <div
            className="flex items-center gap-1 mt-1 text-xs"
            style={{ color: "var(--btn-primary)" }}
          >
            <Navigation className="w-3 h-3" />
            길찾기
          </div>
        )}
      </div>
    </CardWrapper>
  );
});

RestaurantCard.displayName = "RestaurantCard";
