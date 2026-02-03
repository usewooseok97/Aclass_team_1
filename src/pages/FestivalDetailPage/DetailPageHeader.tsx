import { BackButton } from "@/atoms/BackButton";
import { Badge } from "@/atoms/Badge";
import { StarRating } from "@/atoms/StarRating";
import type { Festival } from "@/types/festival";

interface DetailPageHeaderProps {
  festival: Festival;
  onBack: () => void;
}

export const DetailPageHeader = ({
  festival,
  onBack,
}: DetailPageHeaderProps) => {
  const rating = festival.buzz_score / 20;
  const reviewCount = Math.floor(festival.buzz_score * 10);

  return (
    <header className="w-full px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-3">
            <BackButton onClick={onBack} />

            <div className="flex items-center gap-2">
              <Badge text="축제" variant="pink" />
              <Badge text={festival.GUNAME} variant="purple" />
            </div>

            <h1
              className="text-2xl font-bold max-w-2xl"
              style={{ color: "var(--text-primary)" }}
            >
              {festival.TITLE}
            </h1>
          </div>

          <div className="flex flex-col items-end gap-1 pt-10">
            <StarRating rating={rating} showNumber={true} size="lg" />
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              ({reviewCount.toLocaleString()}개의 리뷰)
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
