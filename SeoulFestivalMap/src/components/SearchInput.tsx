import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Utensils, X } from "lucide-react";
import { useFestivalContext } from "@hooks/useFestivalContext";
import type { Festival, Place } from "@/types/festival";

interface SearchInputProps {
  className?: string;
}

interface SearchResult {
  type: "festival" | "place";
  festival?: Festival;
  place?: Place;
  relatedFestivals?: Festival[]; // 맛집이 포함된 축제들
}

const SearchInput = ({ className = "" }: SearchInputProps) => {
  const { allFestivals, allPlaces, navigateToDetail } = useFestivalContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlaceIndex, setSelectedPlaceIndex] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce 0.3초
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 검색 로직
  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const term = debouncedTerm.toLowerCase();
    const searchResults: SearchResult[] = [];

    // 1. 축제 검색 (TITLE, PLACE, GUNAME)
    const matchedFestivals = allFestivals.filter(
      (f) =>
        f.TITLE.toLowerCase().includes(term) ||
        f.PLACE.toLowerCase().includes(term) ||
        f.GUNAME.toLowerCase().includes(term)
    );

    matchedFestivals.slice(0, 5).forEach((festival) => {
      searchResults.push({ type: "festival", festival });
    });

    // 2. 맛집 검색 (name, category)
    const placeSet = new Map<string, { place: Place; festivals: Festival[] }>();

    Object.entries(allPlaces).forEach(([festivalTitle, places]) => {
      const festival = allFestivals.find((f) => f.TITLE === festivalTitle);
      if (!festival) return;

      places.forEach((place) => {
        if (
          place.name.toLowerCase().includes(term) ||
          place.category.toLowerCase().includes(term)
        ) {
          const key = place.name;
          if (placeSet.has(key)) {
            placeSet.get(key)!.festivals.push(festival);
          } else {
            placeSet.set(key, { place, festivals: [festival] });
          }
        }
      });
    });

    // 맛집 결과 추가 (최대 5개)
    Array.from(placeSet.values())
      .slice(0, 5)
      .forEach(({ place, festivals }) => {
        searchResults.push({
          type: "place",
          place,
          relatedFestivals: festivals,
        });
      });

    setResults(searchResults);
    setIsOpen(searchResults.length > 0);
    setSelectedPlaceIndex(null);
  }, [debouncedTerm, allFestivals, allPlaces]);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedPlaceIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 축제 클릭 핸들러
  const handleFestivalClick = (festival: Festival) => {
    navigateToDetail(festival);
    setSearchTerm("");
    setIsOpen(false);
    setSelectedPlaceIndex(null);
  };

  // 맛집 클릭 핸들러 (축제 리스트 토글)
  const handlePlaceClick = (index: number) => {
    setSelectedPlaceIndex(selectedPlaceIndex === index ? null : index);
  };

  // 검색 초기화
  const handleClear = () => {
    setSearchTerm("");
    setResults([]);
    setIsOpen(false);
    setSelectedPlaceIndex(null);
    setHighlightedIndex(-1);
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, results.length - 1)
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          const result = results[highlightedIndex];
          if (result.type === "festival" && result.festival) {
            handleFestivalClick(result.festival);
          } else if (result.type === "place") {
            handlePlaceClick(highlightedIndex);
          }
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // 결과 변경 시 하이라이트 리셋
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [results]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 검색 입력 */}
      <article
        className="flex flex-row items-center p-2 w-[280px] h-9 rounded-[10px]"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--card-border)",
          borderWidth: "1px",
        }}
      >
        <Search
          className="w-4 h-4 mr-2 flex-shrink-0"
          style={{ color: "var(--text-secondary)" }}
        />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="축제 또는 맛집 검색..."
          className="flex-1 outline-none text-sm bg-transparent placeholder-gray-400"
          style={{ color: "var(--text-primary)" }}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results"
          aria-activedescendant={highlightedIndex >= 0 ? `search-option-${highlightedIndex}` : undefined}
          aria-label="축제 또는 맛집 검색"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-200/20"
          >
            <X className="w-3 h-3" style={{ color: "var(--text-secondary)" }} />
          </button>
        )}
      </article>

      {/* 검색 결과 드롭다운 */}
      {isOpen && results.length > 0 && (
        <ul
          id="search-results"
          role="listbox"
          aria-label="검색 결과"
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          {results.map((result, index) => (
            <li key={index} role="presentation">
              {result.type === "festival" && result.festival && (
                <button
                  id={`search-option-${index}`}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => handleFestivalClick(result.festival!)}
                  className={`w-full px-3 py-2 flex items-center gap-2 text-left transition-colors ${
                    index === highlightedIndex ? "bg-gray-100/20" : "hover:bg-gray-100/10"
                  }`}
                >
                  <MapPin
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "var(--btn-primary)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {result.festival.TITLE}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {result.festival.GUNAME} · {result.festival.PLACE}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: "var(--btn-primary)",
                      color: "white",
                    }}
                  >
                    축제
                  </span>
                </button>
              )}

              {result.type === "place" && result.place && (
                <div>
                  <button
                    id={`search-option-${index}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    aria-expanded={selectedPlaceIndex === index}
                    onClick={() => handlePlaceClick(index)}
                    className={`w-full px-3 py-2 flex items-center gap-2 text-left transition-colors ${
                      index === highlightedIndex ? "bg-gray-100/20" : "hover:bg-gray-100/10"
                    }`}
                  >
                    <Utensils
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#f97316" }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {result.place.name}
                      </p>
                      <p
                        className="text-xs truncate"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {result.place.category} ·{" "}
                        {result.relatedFestivals?.length}개 축제에서 표시
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: "#f97316",
                        color: "white",
                      }}
                    >
                      맛집
                    </span>
                  </button>

                  {/* 관련 축제 리스트 (펼침) */}
                  {selectedPlaceIndex === index && result.relatedFestivals && (
                    <div
                      className="pl-8 pb-2"
                      style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                    >
                      <p
                        className="text-xs py-1 px-2"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        이 맛집이 표시되는 축제:
                      </p>
                      {result.relatedFestivals.map((festival, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleFestivalClick(festival)}
                          className="w-full px-2 py-1.5 flex items-center gap-2 hover:bg-gray-100/10 text-left transition-colors"
                        >
                          <MapPin
                            className="w-3 h-3 flex-shrink-0"
                            style={{ color: "var(--btn-primary)" }}
                          />
                          <span
                            className="text-xs truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {festival.TITLE}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* 검색 중 결과 없음 */}
      {isOpen && debouncedTerm && results.length === 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg p-4 text-center z-50"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--card-border)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            "{debouncedTerm}"에 대한 검색 결과가 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export { SearchInput };
