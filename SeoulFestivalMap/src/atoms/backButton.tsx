import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@lib/utils";

interface BackButtonProps {
  onClick: () => void;
  className?: string;
}

export const BackButton = ({ onClick, className }: BackButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex items-center justify-center",
        "w-8 h-8 rounded-full cursor-pointer",
        "transition-colors duration-200",
        className
      )}
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
        borderWidth: "1px",
        color: "var(--btn-primary)",
      }}
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="sr-only">뒤로 가기</span>
    </motion.button>
  );
};
