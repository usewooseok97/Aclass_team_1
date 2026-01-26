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
      aria-label={`${guName} 지역 축제 보기`}
      aria-pressed={isActive}
      role="tab"
      className={cn(
        "flex flex-col justify-center items-center p-0 gap-px",
        "relative w-[93px] min-w-12 h-14 rounded-lg cursor-pointer",
        "transition-all duration-200",
        isActive
          ? "text-white font-semibold shadow-lg scale-105"
          : "hover:shadow-md"
      )}
      style={{
        backgroundColor: isActive ? 'var(--btn-primary)' : 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
      }}
    >
      <span aria-hidden="true" style={{ color: isActive ? 'white' : 'var(--text-primary)' }}>
        {guName}
      </span>
    </motion.button>
  );
};

export { GuButtonContainer };
