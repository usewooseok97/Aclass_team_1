import {
  Building2,
  Users,
  Ticket,
  ParkingCircle,
  Train,
  Phone,
} from "lucide-react";
import { IconText } from "@/atoms/IconText";
import type { Festival } from "@/types/festival";

interface FestivalDetailInfoProps {
  festival: Festival;
}

export const FestivalDetailInfo = ({ festival }: FestivalDetailInfoProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-base font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        상세 정보
      </h3>
      <div className="flex flex-col gap-2">
        <IconText icon={Building2} label="주최" value={festival.ORG_NAME} />
        <IconText icon={Users} label="수용 인원" value="정보 없음" />
        <IconText
          icon={Ticket}
          label="입장료"
          value={festival.IS_FREE === "무료" ? "무료" : "유료 (요금 문의)"}
        />
        <IconText icon={ParkingCircle} label="주차" value="정보 없음" />
        <IconText icon={Train} label="대중교통" value="정보 없음" />
        <IconText icon={Phone} label="문의" value="정보 없음" />
      </div>
    </div>
  );
};
