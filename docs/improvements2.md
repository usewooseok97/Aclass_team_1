# 서울 축제 지도 프로젝트 개선 제안 2

## 1. 반복 코드 개선

### 1.1 인라인 스타일 상수화
**현재 문제:**
카드 배경, 텍스트 색상 스타일이 20개 이상의 위치에서 반복됨
- `FestivalCard.tsx:23-27`
- `RestaurantCard.tsx:58-63`
- `SearchInput.tsx:176-180, 220-223, 352-355`
- `BackButton.tsx:23-28`
- `LeftContent.tsx` (15개 이상 위치)

**개선 방안:**
```typescript
// src/styles/themeStyles.ts
export const cardBgStyle = {
  backgroundColor: 'var(--card-bg)',
  borderColor: 'var(--card-border)',
  borderWidth: '1px',
} as const;

export const textStyles = {
  primary: { color: 'var(--text-primary)' },
  secondary: { color: 'var(--text-secondary)' },
  accent: { color: 'var(--btn-primary)' },
} as const;
```

### 1.2 모션 애니메이션 상수화
**현재 문제:**
동일한 모션 설정이 4개 이상 파일에서 반복
- `GuButtonContainer.tsx:19-22`
- `BackButton.tsx:12-15`
- `FestivalCard.tsx:17-21`
- `FestivalActionButtons.tsx:30-37`

**개선 방안:**
```typescript
// src/constants/animations.ts
export const motionVariants = {
  button: {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  },
  card: {
    whileHover: { scale: 1.02, y: -3 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  },
};
```

### 1.3 이미지 Fallback 컴포넌트
**현재 문제:**
이미지 에러 처리 패턴이 3곳에서 중복
- `LeftContent.tsx:41-49`
- `FestivalImageGallery.tsx:8-37`
- `SeoulMapContainer.tsx:357-365`

**개선 방안:**
```typescript
// src/components/ImageWithFallback.tsx
interface Props {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
}

export const ImageWithFallback = ({ src, alt, fallback, className }: Props) => {
  const [error, setError] = useState(false);
  if (error) return fallback || <div>이미지 로드 실패</div>;
  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />;
};
```

---

## 2. 훅 분리 개선

### 2.1 검색 상태 관리 훅
**현재 문제:** `SearchInput.tsx`에 50줄 이상의 상태 관리 로직 내장

**개선 방안:**
```typescript
// src/hooks/useSearchState.ts
export const useSearchState = (debounceDelay = 300) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), debounceDelay);
    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  const handleClear = () => {
    setSearchTerm("");
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  return { searchTerm, setSearchTerm, debouncedTerm, isOpen, setIsOpen, highlightedIndex, setHighlightedIndex, handleClear };
};
```

### 2.2 클릭 외부 감지 훅
**현재 문제:** `SearchInput.tsx:104-114`에 외부 클릭 감지 로직 존재

**개선 방안:**
```typescript
// src/hooks/useClickOutside.ts
export const useClickOutside = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) callback();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);
};
```

### 2.3 SVG 지도 오버레이 훅
**현재 문제:** `SeoulMapContainer.tsx`에 250줄 이상의 SVG DOM 조작 로직

**개선 방안:**
```typescript
// src/utils/svgMapUtils.ts
export const addBadgeToSvg = (svgDoc: Document, x: number, y: number, ...) => { /* 순수 함수 */ };
export const addMarkerToSvg = (svgDoc: Document, x: number, y: number, ...) => { /* 순수 함수 */ };
export const clearOverlays = (svgDoc: Document) => { /* 순수 함수 */ };

// src/hooks/useSvgMapOverlays.ts
export const useSvgMapOverlays = (districtData: DistrictFestivalData[]) => {
  const updateOverlays = useCallback((svgDoc: Document) => {
    clearOverlays(svgDoc);
    districtData.forEach(d => { addBadgeToSvg(...); addMarkerToSvg(...); });
  }, [districtData]);
  return { updateOverlays };
};
```

### 2.4 평점 계산 훅 확장
**현재 문제:** `rating.ts` 유틸 있지만 reviewCount 계산은 별도로 함

**개선 방안:**
```typescript
// src/hooks/useRating.ts (rating.ts 확장)
export const useRating = (buzzScore: number) => {
  return useMemo(() => ({
    rating: Number((buzzScore / 20).toFixed(1)),
    fullStars: Math.floor(buzzScore / 20),
    hasHalfStar: (buzzScore / 20) % 1 >= 0.5,
    reviewCount: Math.floor(buzzScore * 10),
  }), [buzzScore]);
};
```

---

## 3. 컴포넌트 구조 개선

### 3.1 Container 래퍼 제거
**현재 문제:**
스타일만 적용하는 불필요한 Container 컴포넌트들
- `LeftSectionContainer.tsx`
- `RightSectionContainer.tsx`
- `HeaderContainer.tsx`
- `FooterContainer.tsx`

**개선 방안:**
```typescript
// src/styles/layoutStyles.ts
export const sectionStyles = {
  left: "h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col justify-between items-center rounded-tr-[40px] rounded-br-[40px]",
  right: "h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col items-center border rounded-tl-[40px] rounded-bl-[40px] p-12",
};

// 사용: <section className={sectionStyles.left}>{children}</section>
```

### 3.2 Atom 컴포넌트 통합
**현재 문제:**
일회성 텍스트 래퍼들이 너무 많음
- `TitleText.tsx`
- `ContentsText.tsx`
- `FooterText.tsx`

**개선 방안:**
```typescript
// src/atoms/Text.tsx
type TextVariant = 'title' | 'content' | 'footer';

interface Props {
  variant: TextVariant;
  children: React.ReactNode;
  className?: string;
}

export const Text = ({ variant, children, className }: Props) => {
  const styles = {
    title: 'text-4xl font-bold',
    content: 'text-xl leading-relaxed',
    footer: 'text-sm',
  };
  return (
    <p className={cn(styles[variant], className)} style={{ color: 'var(--text-primary)' }}>
      {children}
    </p>
  );
};
```

### 3.3 SeoulMapContainer 분리 (HIGH)
**현재 문제:** 402줄의 대형 컴포넌트

**개선 방안:**
```
src/containers/SeoulMapContainer.tsx (조합만 담당, 100줄 이하)
├── src/components/MapTooltip.tsx (툴팁 컴포넌트)
├── src/hooks/useSvgMapOverlays.ts (오버레이 훅)
└── src/utils/svgMapUtils.ts (DOM 조작 유틸)
```

### 3.4 LeftContent 조건부 렌더링 분리
**현재 문제:** 선택 상태에 따라 완전히 다른 UI를 렌더링

**개선 방안:**
```typescript
// src/containers/LeftContentDefault.tsx - 지도/버튼 화면
// src/containers/LeftContentPreview.tsx - 축제 미리보기 화면

// LeftContent.tsx
const LeftContent = memo(() => {
  const { selectedFestival } = useFestivalContext();
  return selectedFestival ? <LeftContentPreview /> : <LeftContentDefault />;
});
```

---

## 4. Context/상태관리 개선

### 4.1 Context 분리 (HIGH)
**현재 문제:**
FestivalContext에 18개 값이 하나의 객체에 번들링
- 컴포넌트가 2-3개만 필요해도 18개 전체를 구독
- 하나의 값 변경 시 모든 구독 컴포넌트 리렌더링

**개선 방안:**
```typescript
// 3개의 Context로 분리
DataContext: allFestivals, allPlaces, weather, isLoading, error
FilterContext: selectedDistrict, selectedFestival, selectedSeason + setters
NavigationContext: viewMode, navigateToDetail, navigateBack, navigateToNotFound

// 전용 훅
useData()       // 데이터만 구독 (변경 거의 없음)
useFilter()     // 필터 상태만 구독
useNavigation() // 네비게이션만 구독
```

### 4.2 파생 상태 훅 분리
**현재 문제:**
`filteredFestivals`, `nearbyPlaces`가 Context 내부 useMemo에 있음

**개선 방안:**
```typescript
// src/hooks/useFilteredFestivals.ts
export const useFilteredFestivals = () => {
  const { allFestivals } = useData();
  const { selectedDistrict, selectedSeason } = useFilter();

  return useMemo(() => {
    if (!selectedDistrict) return [];
    return allFestivals.filter(f =>
      f.GUNAME === selectedDistrict &&
      (selectedSeason === '전체' || f.season === selectedSeason)
    );
  }, [allFestivals, selectedDistrict, selectedSeason]);
};

// src/hooks/useNearbyPlaces.ts
export const useNearbyPlaces = () => {
  const { allPlaces } = useData();
  const { selectedFestival } = useFilter();

  return useMemo(() => {
    if (!selectedFestival) return [];
    return allPlaces[selectedFestival.TITLE] || [];
  }, [allPlaces, selectedFestival]);
};
```

### 4.3 상태 변경 원자화
**현재 문제:**
`setSelectedDistrict`가 3개 상태를 순차 변경 → cascade 리렌더링

```typescript
// 현재 코드
const setSelectedDistrict = (district: string | null) => {
  setSelectedDistrictState(district);      // 1번째 렌더링
  setSelectedFestivalState(null);          // 2번째 렌더링
  setViewMode(district ? 'list' : 'map');  // 3번째 렌더링
};
```

**개선 방안:**
```typescript
// useReducer 사용으로 원자적 업데이트
const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SELECT_DISTRICT':
      return {
        ...state,
        selectedDistrict: action.payload,
        selectedFestival: null,
        viewMode: action.payload ? 'list' : 'map'
      };
    case 'SELECT_FESTIVAL':
      return { ...state, selectedFestival: action.payload };
    case 'SELECT_SEASON':
      return { ...state, selectedSeason: action.payload };
    default:
      return state;
  }
};

// 한 번의 dispatch로 모든 상태 변경
dispatch({ type: 'SELECT_DISTRICT', payload: 'gangnam' });
```

---

## 5. 우선순위 로드맵

| 순서 | 개선 항목 | 난이도 | 효과 | 비고 |
|------|---------|--------|------|------|
| 1 | SeoulMapContainer 분리 | 높음 | 높음 | 가독성 + 테스트 용이성 |
| 2 | Context 분리 (3개) | 높음 | 높음 | 리렌더링 최적화 |
| 3 | 인라인 스타일 상수화 | 낮음 | 중간 | 일관성 + 유지보수 |
| 4 | useSearchState 훅 분리 | 중간 | 중간 | 재사용성 |
| 5 | useClickOutside 훅 | 낮음 | 중간 | 범용 유틸리티 |
| 6 | Container 래퍼 제거 | 낮음 | 낮음 | 코드 간결화 |
| 7 | Atom 컴포넌트 통합 | 중간 | 낮음 | 파일 수 감소 |
| 8 | 모션 애니메이션 상수화 | 낮음 | 낮음 | 일관성 |
| 9 | ImageWithFallback 컴포넌트 | 낮음 | 낮음 | 재사용성 |
