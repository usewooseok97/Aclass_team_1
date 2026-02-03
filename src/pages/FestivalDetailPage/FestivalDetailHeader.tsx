import { BackButton } from "@/atoms/BackButton";
import { Badge } from "@/atoms/Badge";
import { StarRating } from "@/atoms/StarRating";
import type { Festival } from "@/types/festival";

interface FestivalDetailHeaderProps {
  festival: Festival;
  onBack: () => void;
}

export const FestivalDetailHeader = ({
  festival,
  onBack,
}: FestivalDetailHeaderProps) => {
  const rating = festival.buzz_score / 20;
  const reviewCount = Math.floor(festival.buzz_score * 10);

  return (
    <div className="flex flex-col gap-3">
      <BackButton onClick={onBack} className="self-start" />

      <div className="flex items-center gap-2">
        <Badge text="축제" variant="pink" />
        <Badge text={festival.GUNAME} variant="purple" />
      </div>

      <h1
        className="text-2xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {festival.TITLE}
      </h1>

      <StarRating rating={rating} reviewCount={reviewCount} size="md" />
    </div>
  );
};
