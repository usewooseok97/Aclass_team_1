import { useFestivalContext } from "@hooks/useFestivalContext";
import { useTimePhase } from "@hooks/useTimePhase";
import { CardLayout } from "@atoms/CardLayout";
import { FullWidthCard } from "@atoms/FullWidthCard";
import { FooterContainer } from "@containers/FooterContainer";
import { LanguageButton } from "@atoms/LanguageButton";
import { FooterText } from "@atoms/FooterText";
import { TEXT_LIST } from "@constants/textConstants";
import { DetailPageHeader } from "./DetailPageHeader";
import { FestivalImageGallery } from "./FestivalImageGallery";
import { FestivalBasicInfo } from "./FestivalBasicInfo";
import { FestivalDescription } from "./FestivalDescription";
import { NearbyRestaurants } from "./NearbyRestaurants";
import { FestivalDetailInfo } from "./FestivalDetailInfo";
import { FestivalActionButtons } from "./FestivalActionButtons";
import { FestivalLocationMap } from "./FestivalLocationMap";
import img from "@assets/mainBackground.png";

const getGradient = (phase: string): string => {
  switch (phase) {
    case "morning":
      return "linear-gradient(to right, #fda4af, #fdba74, #fef08a)";
    case "day":
      return "linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)";
    case "sunset":
      return "linear-gradient(to right, #f97316, #db2777, #7c3aed)";
    case "night":
      return "linear-gradient(to right, #1e1b4b, #312e81, #1e3a5f)";
    default:
      return "linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)";
  }
};

const getThemeColors = (phase: string): React.CSSProperties =>
  ({
    "--text-primary":
      phase === "night"
        ? "#f1f5f9"
        : phase === "sunset"
        ? "#581c87"
        : "#1e293b",
    "--text-secondary":
      phase === "night"
        ? "#94a3b8"
        : phase === "sunset"
        ? "#a855f7"
        : "#64748b",
    "--btn-primary":
      phase === "morning"
        ? "#f97316"
        : phase === "night"
        ? "#818cf8"
        : phase === "sunset"
        ? "#7c3aed"
        : "#6750A4",
    "--btn-hover":
      phase === "morning"
        ? "#ea580c"
        : phase === "night"
        ? "#6366f1"
        : phase === "sunset"
        ? "#6d28d9"
        : "#5b3f9a",
    "--card-bg":
      phase === "night" ? "rgba(30,27,75,0.7)" : "rgba(255,255,255,0.85)",
    "--card-border":
      phase === "morning"
        ? "#fdba74"
        : phase === "night"
        ? "#4c1d95"
        : phase === "sunset"
        ? "#c084fc"
        : "#93c5fd",
  } as React.CSSProperties);

export const FestivalDetailPage = () => {
  const { selectedFestival, nearbyPlaces, navigateBack } = useFestivalContext();
  const { phase } = useTimePhase();

  if (!selectedFestival) {
    return null;
  }

  return (
    <div
      className="relative w-full min-h-screen"
      style={getThemeColors(phase)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{ background: getGradient(phase) }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col">
        <DetailPageHeader festival={selectedFestival} onBack={navigateBack} />

        <main className="flex flex-row flex-wrap justify-center gap-10 w-full px-4 py-6">
          {/* 좌측 컬럼 */}
          <section className="w-[40%] min-w-[320px] flex flex-col gap-4">
            {/* 좌측 상단: 기본 정보 + 이미지 */}
            <CardLayout>
              <div className="p-4 flex flex-col gap-4 w-full">
                <FestivalImageGallery
                  mainImage={selectedFestival.MAIN_IMG}
                  title={selectedFestival.TITLE}
                />
                <FestivalBasicInfo festival={selectedFestival} />
              </div>
            </CardLayout>

            {/* 좌측 하단: 주변 맛집 */}
            <CardLayout>
              <div className="p-4 w-full">
                <NearbyRestaurants places={nearbyPlaces} />
              </div>
            </CardLayout>
          </section>

          {/* 우측 컬럼 */}
          <section className="w-[40%] min-w-[320px] flex flex-col gap-4">
            {/* 우측 상단: 상세 정보 */}
            <CardLayout>
              <div className="p-4 w-full">
                <FestivalDetailInfo festival={selectedFestival} />
              </div>
            </CardLayout>

            {/* 우측 하단: 축제 소개 + 버튼 */}
            <CardLayout>
              <div className="p-4 w-full">
                <FestivalDescription program={selectedFestival.PROGRAM} />
                <FestivalActionButtons
                  homepageUrl={selectedFestival.HMPG_ADDR}
                />
              </div>
            </CardLayout>
          </section>
        </main>

        {/* 하단: 오시는 길 (전체 너비) */}
        <div className="w-full px-4 pb-6">
          <FullWidthCard>
            <div className="p-6">
              <FestivalLocationMap place={selectedFestival.PLACE} />
            </div>
          </FullWidthCard>
        </div>

        <FooterContainer>
          <LanguageButton />
          <FooterText text={TEXT_LIST.FOOTER} />
        </FooterContainer>
      </div>
    </div>
  );
};
