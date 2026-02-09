import type { ReactNode } from "react";
import { useTimePhase } from "@/hooks/useTimePhase";
import { useFestivalContext } from "@/hooks/useFestivalContext";
import { getGradient, getThemeColors } from "@/utils/theme";
import { SeasonalParticles } from "@/components/SeasonalParticles";
import img from "@/assets/mainBackground.png";

interface BackgroundContainerProps {
  children: ReactNode;
}

const BackgroundContainer = ({ children }: BackgroundContainerProps) => {
  const { phase } = useTimePhase();
  const { selectedSeason } = useFestivalContext();

  return (
    <div className="relative w-full min-h-screen" style={getThemeColors(phase)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: getGradient(phase) }}
      />
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <SeasonalParticles selectedSeason={selectedSeason} />
      </div>
      {children}
    </div>
  );
};

export { BackgroundContainer };
