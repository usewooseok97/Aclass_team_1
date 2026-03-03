import type { ReactNode } from "react";
import { useTimePhase } from "@/hooks/useTimePhase";
import { useFestivalContext } from "@/hooks/useFestivalContext";
import { getGradient, getThemeColors } from "@/utils/theme";
import { SeasonalParticles } from "@/components/SeasonalParticles";
import mainImg from "@/assets/mainBackground.png";
import springImg from "@/assets/spring.png";
import summerImg from "@/assets/summer.png";
import fallImg from "@/assets/fall.png";
import winterImg from "@/assets/winter.png";
import type { Season } from "@/types/festival";

interface BackgroundContainerProps {
  children: ReactNode;
}

type ActiveSeason = Exclude<Season, "전체">;

const seasonImages: Record<ActiveSeason, string> = {
  "봄": springImg,
  "여름": summerImg,
  "가을": fallImg,
  "겨울": winterImg,
};

const seasonMeta: Record<ActiveSeason, { label: string; color: string }> = {
  "봄": { label: "봄 🌸", color: "bg-pink-400" },
  "여름": { label: "여름 ☀️", color: "bg-yellow-500" },
  "가을": { label: "가을 🍁", color: "bg-orange-500" },
  "겨울": { label: "겨울 ❄️", color: "bg-blue-400" },
};

function getCurrentSeason(): ActiveSeason {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  if (month >= 9 && month <= 11) return "가을";
  return "겨울";
}

const BackgroundContainer = ({ children }: BackgroundContainerProps) => {
  const { phase } = useTimePhase();
  const { selectedSeason } = useFestivalContext();

  const activeSeason: ActiveSeason = selectedSeason === "전체" ? getCurrentSeason() : selectedSeason;
  const backgroundImage = seasonImages[activeSeason] ?? mainImg;
  const { label, color } = seasonMeta[activeSeason];

  return (
    <div className="relative w-full min-h-screen" style={getThemeColors(phase)}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: getGradient(phase), opacity: 0.55 }}
      />
      <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
        <SeasonalParticles selectedSeason={selectedSeason} />
      </div>
      {/* 모바일 전용 계절 배지 */}
      <div className="absolute top-3 right-3 z-2 md:hidden">
        <span className={`${color} text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md`}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
};

export { BackgroundContainer };
