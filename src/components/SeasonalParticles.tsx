import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";
import type { Season } from "@/types/festival";

function getCurrentSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return "봄";
  if (month >= 6 && month <= 8) return "여름";
  if (month >= 9 && month <= 11) return "가을";
  return "겨울";
}

// 봄: 벚꽃
const springConfig: ISourceOptions = {
  fullScreen: false,
  particles: {
    number: { value: 25, density: { enable: true } },
    shape: {
      type: "emoji",
      options: { emoji: { value: ["🌸", "🏵️"] } },
    },
    opacity: {
      value: { min: 0.4, max: 0.8 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: {
      value: { min: 8, max: 16 },
    },
    move: {
      enable: true,
      speed: { min: 0.5, max: 1.5 },
      direction: "bottom" as const,
      outModes: { default: "out" as const },
      random: true,
    },
    rotate: {
      value: { min: 0, max: 360 },
      animation: { enable: true, speed: 5, sync: false },
    },
  },
  detectRetina: true,
};

// 여름: 반짝이는 햇살
const summerConfig: ISourceOptions = {
  fullScreen: false,
  particles: {
    number: { value: 30, density: { enable: true } },
    color: { value: ["#FFD700", "#FFA500", "#FFEC8B", "#FFFACD"] },
    shape: { type: "star" },
    opacity: {
      value: { min: 0.2, max: 0.7 },
      animation: { enable: true, speed: 1.5, sync: false },
    },
    size: {
      value: { min: 2, max: 6 },
      animation: { enable: true, speed: 3, sync: false },
    },
    move: {
      enable: true,
      speed: { min: 0.5, max: 2 },
      direction: "none" as const,
      outModes: { default: "out" as const },
      random: true,
    },
    twinkle: {
      particles: { enable: true, frequency: 0.05, color: { value: "#FFFFFF" }, opacity: 0.8 },
    },
  },
  detectRetina: true,
};

// 가을: 낙엽
const autumnConfig: ISourceOptions = {
  fullScreen: false,
  particles: {
    number: { value: 20, density: { enable: true } },
    shape: {
      type: "emoji",
      options: { emoji: { value: ["🍂", "🍁", "🍃"] } },
    },
    opacity: {
      value: { min: 0.4, max: 0.8 },
      animation: { enable: true, speed: 0.5, sync: false },
    },
    size: {
      value: { min: 10, max: 18 },
    },
    move: {
      enable: true,
      speed: { min: 0.5, max: 1.5 },
      direction: "bottom" as const,
      outModes: { default: "out" as const },
      random: true,
    },
    rotate: {
      value: { min: 0, max: 360 },
      animation: { enable: true, speed: 4, sync: false },
    },
  },
  detectRetina: true,
};

// 겨울: 눈송이
const winterConfig: ISourceOptions = {
  fullScreen: false,
  particles: {
    number: { value: 35, density: { enable: true } },
    shape: {
      type: "emoji",
      options: { emoji: { value: ["❄", "❆"] } },
    },
    opacity: {
      value: { min: 0.3, max: 0.9 },
      animation: { enable: true, speed: 0.8, sync: false },
    },
    size: { value: { min: 6, max: 14 } },
    move: {
      enable: true,
      speed: { min: 0.3, max: 1 },
      direction: "bottom" as const,
      outModes: { default: "out" as const },
      random: true,
    },
  },
  detectRetina: true,
};

const seasonConfigs: Record<Exclude<Season, "전체">, ISourceOptions> = {
  "봄": springConfig,
  "여름": summerConfig,
  "가을": autumnConfig,
  "겨울": winterConfig,
};

interface SeasonalParticlesProps {
  selectedSeason: Season;
}

export const SeasonalParticles = ({ selectedSeason }: SeasonalParticlesProps) => {
  const [init, setInit] = useState(false);
  const containerRef = useRef<Container | null>(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  // 언마운트 시 컨테이너 정리
  useEffect(() => {
    return () => {
      containerRef.current?.destroy();
      containerRef.current = null;
    };
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    containerRef.current = container ?? null;
  }, []);

  const activeSeason = selectedSeason === "전체" ? getCurrentSeason() : selectedSeason;
  const options = useMemo(() => seasonConfigs[activeSeason], [activeSeason]);

  if (!init) return null;

  return (
    <Particles
      id="seasonal-particles"
      options={options}
      particlesLoaded={particlesLoaded}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};
