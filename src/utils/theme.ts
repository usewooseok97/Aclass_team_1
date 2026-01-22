import React from "react";

export type TimePhase = "morning" | "day" | "sunset" | "night";

export const getGradient = (phase: string): string => {
  switch (phase) {
    case "morning":
      return "linear-gradient(to right, #fda4af, #fdba74, #fef08a)";
    case "day":
      return "linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)";
    case "sunset":
      return "linear-gradient(to right, #f97316, #db2777, #7c3aed)";
    case "night":
      return "linear-gradient(to right, #1e1b4b, #312e81, #1e3a5f)";
    default:
      return "linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)";
  }
};

export const getThemeColors = (phase: string): React.CSSProperties =>
  ({
    "--text-primary":
      phase === "night"
        ? "#f1f5f9"
        : phase === "sunset"
          ? "#581c87"
          : "#1e293b",
    "--text-secondary":
      phase === "night"
        ? "#94a3b8"
        : phase === "sunset"
          ? "#a855f7"
          : "#64748b",
    "--btn-primary":
      phase === "morning"
        ? "#f97316"
        : phase === "night"
          ? "#818cf8"
          : phase === "sunset"
            ? "#7c3aed"
            : "#6750A4",
    "--btn-hover":
      phase === "morning"
        ? "#ea580c"
        : phase === "night"
          ? "#6366f1"
          : phase === "sunset"
            ? "#6d28d9"
            : "#5b3f9a",
    "--card-bg":
      phase === "night" ? "rgba(30,27,75,0.7)" : "rgba(255,255,255,0.85)",
    "--card-border":
      phase === "morning"
        ? "#fdba74"
        : phase === "night"
          ? "#4c1d95"
          : phase === "sunset"
            ? "#c084fc"
            : "#93c5fd",
  }) as React.CSSProperties;
