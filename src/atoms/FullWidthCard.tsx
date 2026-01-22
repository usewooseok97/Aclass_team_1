import type { ReactNode } from "react";
import { cn } from "@lib/utils";

interface FullWidthCardProps {
  children: ReactNode;
  className?: string;
}

export const FullWidthCard = ({ children, className }: FullWidthCardProps) => {
  return (
    <div
      className={cn(
        "w-full rounded-[20px] border transition-all duration-300",
        className
      )}
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {children}
    </div>
  );
};
