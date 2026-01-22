import { MapPin, Calendar, Users } from "lucide-react";
import { IconText } from "@atoms/IconText";
import type { Festival } from "@/types/festival";

interface FestivalBasicInfoProps {
  festival: Festival;
}

export const FestivalBasicInfo = ({ festival }: FestivalBasicInfoProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-base font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        기본 정보
      </h3>
      <div className="flex flex-col gap-2">
        <IconText icon={MapPin} label="위치" value={festival.PLACE} />
        <IconText icon={Calendar} label="기간" value={festival.DATE} />
        <IconText icon={Users} label="대상 연령대" value={festival.USE_TRGT} />
      </div>
    </div>
  );
};
