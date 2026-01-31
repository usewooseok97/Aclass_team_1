import { motion } from "motion/react";
import { useFestivalContext } from "@hooks/useFestivalContext";
import { useTimePhase } from "@hooks/useTimePhase";
import { LanguageButton } from "@atoms/LanguageButton";
import { FooterText } from "@atoms/FooterText";
import { getGradient, getThemeColors } from "@utils/theme";
import img from "@assets/mainBackground.png";
import { FooterContainer } from "@/containers/FooterContainer";
import { TEXT_LIST } from "@/constants/textConstants";

const NotFoundPage = () => {
  const { setViewMode } = useFestivalContext();
  const { phase } = useTimePhase();

  const handleGoHome = () => {
    setViewMode("map");
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col"
      style={getThemeColors(phase)}
    >
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />

      {/* 그라데이션 오버레이 */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: getGradient(phase) }}
      />

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 텍스트 */}
          <h1
            className="text-8xl md:text-9xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            404
          </h1>

          {/* 데코레이션 */}
          <div
            className="flex items-center justify-center mb-4 text-2xl"
            style={{ color: "var(--text-primary)" }}
          >
            <span>&#8767;</span>
          </div>

          {/* 메인 메시지 */}
          <h2
            className="text-2xl md:text-3xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            길을 잃으셨군요!
          </h2>

          {/* 설명 */}
          <p
            className="text-base md:text-lg mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            아래 버튼을 누르면 되돌아갈 수 있어요!
          </p>

          {/* GO HOME 버튼 */}
          <motion.button
            onClick={handleGoHome}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full border-2 font-medium transition-colors duration-200 cursor-pointer bg-transparent"
            style={{
              borderColor: "var(--text-primary)",
              color: "var(--text-primary)",
            }}
          >
            GO HOME
          </motion.button>
        </motion.div>
      </main>
      <FooterContainer>
        <LanguageButton />
        <FooterText text={TEXT_LIST.FOOTER} />
      </FooterContainer>
    </div>
  );
};

export { NotFoundPage };
