import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const cardVariants = cva(
  // 기본 스타일
  "flex flex-col items-center w-full min-h-[394px] justify-center transition-all duration-300",
  {
    variants: {
      variant: {
        default: "border border-black/50 rounded-tr-[40px] rounded-br-[40px]",
        glass:
          "backdrop-blur-xl bg-white/30 border border-white/20 rounded-tr-[40px] rounded-br-[40px] shadow-lg",
        solid:
          "bg-white border border-gray-300 rounded-tr-[40px] rounded-br-[40px] shadow-md",
      },
      hover: {
        none: "",
        lift: "hover:shadow-xl hover:-translate-y-1",
        glow: "hover:shadow-lg hover:shadow-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "none",
    },
  }
);

interface CardLayoutProps extends VariantProps<typeof cardVariants> {
  children: React.ReactNode;
  className?: string;
}

const CardLayout = ({
  children,
  variant,
  hover,
  className = "",
}: CardLayoutProps) => {
  return (
    <section className={cn(cardVariants({ variant, hover }), className)}>
      {children}
    </section>
  );
};

export { CardLayout };
