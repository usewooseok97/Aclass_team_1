import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800",
        pink: "bg-pink-100 text-pink-700",
        purple: "bg-purple-100 text-purple-700",
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        orange: "bg-orange-100 text-orange-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  text: string;
  className?: string;
}

export const Badge = ({ text, variant, className }: BadgeProps) => {
  return (
    <span className={cn(badgeVariants({ variant }), className)}>
      {text}
    </span>
  );
};
