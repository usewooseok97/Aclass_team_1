import type { CSSProperties } from "react";

export const textStyles = {
  primary: { color: "var(--text-primary)" } as CSSProperties,
  secondary: { color: "var(--text-secondary)" } as CSSProperties,
} as const;

export const cardStyles = {
  background: { backgroundColor: "var(--card-bg)" } as CSSProperties,
  border: {
    borderColor: "var(--card-border)",
    borderWidth: "1px",
  } as CSSProperties,
  full: {
    backgroundColor: "var(--card-bg)",
    borderColor: "var(--card-border)",
    borderWidth: "1px",
  } as CSSProperties,
} as const;

export const buttonStyles = {
  primary: {
    backgroundColor: "var(--btn-primary)",
    color: "white",
  } as CSSProperties,
} as const;
