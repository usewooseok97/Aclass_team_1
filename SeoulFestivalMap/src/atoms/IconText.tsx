import type { LucideIcon } from "lucide-react";
import { cn } from "@lib/utils";

interface IconTextProps {
  icon: LucideIcon;
  label?: string;
  value: string;
  iconColor?: string;
  className?: string;
}

export const IconText = ({
  icon: Icon,
  label,
  value,
  iconColor,
  className,
}: IconTextProps) => {
  return (
    <div
      className={cn("flex items-start gap-2 text-sm", className)}
      style={{ color: "var(--text-secondary)" }}
    >
      <Icon
        className="w-4 h-4 shrink-0 mt-0.5"
        style={{ color: iconColor || "var(--btn-primary)" }}
      />
      <span>
        {label && <span className="font-medium">{label} : </span>}
        {value}
      </span>
    </div>
  );
};
