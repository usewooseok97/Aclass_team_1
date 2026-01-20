import { motion } from "motion/react";
import { useFestivalContext } from "../hooks/useFestivalContext";
import { cn } from "@lib/utils";

interface GuButtonContainerProps {
  guName: string;
}

const GuButtonContainer = ({ guName }: GuButtonContainerProps) => {
  const { selectedDistrict, setSelectedDistrict } = useFestivalContext();

  const handleClick = () => {
    setSelectedDistrict(guName);
  };

  const isActive = selectedDistrict === guName;

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex flex-col justify-center items-center p-0 gap-px",
        "relative w-[93px] min-w-12 h-14 rounded-lg cursor-pointer",
        "transition-all duration-200",
        isActive
          ? "bg-[#6750A4] text-white font-semibold shadow-lg scale-105"
          : "bg-[#E8DEF8] hover:bg-[#D0BCFF] hover:shadow-md"
      )}
    >
      {guName}
    </motion.button>
  );
};

export { GuButtonContainer };
