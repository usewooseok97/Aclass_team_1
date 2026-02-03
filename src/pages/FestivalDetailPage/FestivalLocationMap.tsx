import { MapPin, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useNaverMap } from "@/hooks/useNaverMap";
import { useFestivalContext } from "@/hooks/useFestivalContext";
import { getNaverMapSearchUrl } from "@/utils/naverMap";

export const FestivalLocationMap = () => {
  const { selectedFestival, nearbyPlaces } = useFestivalContext();

  const { containerRef, isLoading, error } = useNaverMap({
    festival: selectedFestival,
    places: nearbyPlaces,
  });

  return (
    <div className="flex flex-col gap-3">
      <h3
        className="text-base font-bold flex items-center gap-2"
        style={{ color: "var(--text-primary)" }}
      >
        <MapPin className="w-5 h-5" style={{ color: "var(--btn-primary)" }} />
        오시는 길
      </h3>

      {error ? (
        <div
          className="w-full h-48 rounded-lg flex flex-col items-center justify-center gap-2"
          style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
        >
          <AlertCircle className="w-8 h-8 text-red-500" />
          <span className="text-sm text-red-500">{error}</span>
        </div>
      ) : (
        <div className="relative w-full h-80 rounded-lg overflow-hidden">
          {isLoading && (
            <div
              className="absolute inset-0 flex items-center justify-center z-10"
              style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            >
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: "var(--btn-primary)" }}
              />
            </div>
          )}
          <div
            ref={containerRef}
            className="w-full h-full"
            style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
          />
        </div>
      )}

      {selectedFestival && (
        <a
          href={getNaverMapSearchUrl(
            selectedFestival.PLACE,
            selectedFestival.GUNAME,
            selectedFestival.mapx,
            selectedFestival.mapy
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm flex items-center gap-1 hover:underline cursor-pointer"
          style={{ color: "var(--btn-primary)" }}
        >
          <ExternalLink className="w-4 h-4" />
          위치: {selectedFestival.PLACE}
        </a>
      )}
    </div>
  );
};
