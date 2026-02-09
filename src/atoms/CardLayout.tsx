import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@lib/utils";

const cardVariants = cva(
  // 기본 스타일
  "flex flex-col items-center w-full h-auto min-h-[300px] md:h-[394px] overflow-auto transition-all duration-300 scrollbar-hide",
  {
    variants: {
      variant: {
        default: "border border-black/50 rounded-[20px] md:rounded-tr-[40px] md:rounded-br-[40px] md:rounded-tl-none md:rounded-bl-none",
        glass:
          "backdrop-blur-xl bg-white/30 border border-white/20 rounded-[20px] md:rounded-tr-[40px] md:rounded-br-[40px] md:rounded-tl-none md:rounded-bl-none shadow-lg",
        solid:
          "bg-white border border-gray-300 rounded-[20px] md:rounded-tr-[40px] md:rounded-br-[40px] md:rounded-tl-none md:rounded-bl-none shadow-md",
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
    <section
      className={cn(cardVariants({ variant, hover }), className)}
      style={{
        borderColor: 'var(--card-border)',
      }}
    >
      {children}
    </section>
  );
};

export { CardLayout };
