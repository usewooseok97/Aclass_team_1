import { MapPin } from "lucide-react";

interface FestivalLocationMapProps {
  place: string;
}

export const FestivalLocationMap = ({ place }: FestivalLocationMapProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-base font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        오시는 길
      </h3>

      <div
        className="w-full h-48 rounded-lg flex flex-col items-center justify-center gap-2"
        style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
      >
        <MapPin
          className="w-8 h-8"
          style={{ color: "var(--text-secondary)" }}
        />
        <span
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          지도가 여기에 표시됩니다
        </span>
      </div>

      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
        위치 : {place}
      </p>
    </div>
  );
};
