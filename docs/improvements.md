# 서울 축제 지도 프로젝트 개선 제안

## 1. 스타일 개선

### 1.1 테마 색상 일관성 부족
**현재 문제:**
- `PlaceCard.tsx`: `bg-white` 하드코딩 (테마 변수 미사용)
- `LoadingState.tsx`: `border-purple-600` 하드코딩
- 일부 컴포넌트에서 `var(--card-bg)` 대신 직접 색상 지정

**개선 방안:**
```tsx
// 변경 전
<div className="bg-white border-gray-200">

// 변경 후
<div style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
```

### 1.2 반응형 디자인 미흡
**현재 문제:**
- `SeoulMapContainer.tsx`: `w-[60%]` 고정값 → 모바일에서 너무 좁음
- `FestivalListContainer.tsx`: `max-h-150` (유효하지 않은 Tailwind 값)
- 터치 타겟 크기 작음 (아이콘 w-4 h-4)

**개선 방안:**
```tsx
// 변경 전
<div className="relative w-[60%] h-full">

// 변경 후
<div className="relative w-full md:w-[60%] lg:w-[60%] h-full">
```

### 1.3 CSS 유틸리티 중복
**현재 문제:**
- `index.css`의 `.ellipsis`, `.multi-ellipsis` → Tailwind `truncate`, `line-clamp-3`으로 대체 가능

---

## 2. 구조 개선

### 2.1 파일 네이밍 불일관
**현재 문제:**
- `backButton.tsx` (camelCase)
- `LanguageButton.tsx` (PascalCase)

**개선 방안:** 모든 컴포넌트를 PascalCase로 통일
```
backButton.tsx → BackButton.tsx
```

### 2.2 코드 중복
**현재 문제:** 평점 계산 로직이 3곳에서 중복
- `LeftContent.tsx:28`
- `RightContentDetail.tsx:15`
- `FestivalCard.tsx:13`

**개선 방안:** 유틸 함수로 추출
```typescript
// src/utils/rating.ts
export const calculateRating = (buzzScore: number) => {
  const rating = Number((buzzScore / 20).toFixed(1));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  return { rating, fullStars, hasHalfStar };
};
```

### 2.3 메모이제이션 부족
**현재 문제:**
- `LeftContent.tsx`, `RightContent.tsx`: `React.memo` 미적용
- `SeoulMapContainer.tsx`: 이벤트 핸들러에 `useCallback` 미적용
- `FestivalListContainer.tsx`: `sortedFestivals`에 `useMemo` 미적용

**개선 방안:**
```tsx
// 변경 전
const sortedFestivals = [...filteredFestivals].sort((a, b) => b.buzz_score - a.buzz_score);

// 변경 후
const sortedFestivals = useMemo(
  () => [...filteredFestivals].sort((a, b) => b.buzz_score - a.buzz_score),
  [filteredFestivals]
);
```

---

## 3. 추가 기능

### 3.1 찜하기/위시리스트 (HIGH)
**설명:** 관심 축제를 저장하고 나중에 볼 수 있는 기능
- 축제 카드에 하트 아이콘 추가
- LocalStorage에 저장
- "찜한 축제만 보기" 필터

**구현 파일:**
- `src/contexts/FestivalContext.tsx` (상태 추가)
- `src/components/FestivalCard.tsx` (UI 추가)
- `src/utils/localStorage.ts` (신규)

### 3.2 날짜 필터 (HIGH)
**설명:** 특정 날짜/기간에 열리는 축제 검색
- DatePicker 컴포넌트 추가
- "다가올 축제", "현재 진행중" 버튼

**라이브러리:** `react-datepicker` 또는 `dayjs`

### 3.3 사용자 평가/후기 (MEDIUM)
**설명:** 축제별 사용자 리뷰 및 평점
- 1-5점 평점 시스템
- 짧은 후기 작성
- 평점 순 정렬 옵션

### 3.4 마이 일정 캘린더 (MEDIUM)
**설명:** 찜한 축제를 캘린더에 표시
- 월별 축제 개수 표시
- 축제 기간 시각화

**라이브러리:** `react-calendar`

### 3.5 거리 표시 (MEDIUM)
**설명:** 사용자 위치 기반 축제까지 거리 표시
- Geolocation API 활용
- "내 위치에서 가까운 순" 정렬

---

## 4. 변경 기능

### 4.1 SearchInput 키보드 네비게이션
**현재 문제:** 드롭다운에서 Arrow/Enter 키 미지원

**개선 방안:**
- Arrow Up/Down으로 결과 탐색
- Enter로 선택
- Escape로 닫기

### 4.2 에러 처리 강화
**현재 문제:**
- 데이터 로드 실패 시 재시도 버튼 없음
- 개별 API 실패 시 어느 것인지 표시 안 함
- 이미지 로드 실패 시 대체 이미지 없음

**개선 방안:**
```tsx
// ErrorState에 재시도 버튼 추가
<button onClick={retry}>다시 시도</button>

// 이미지 fallback
<img src={url} onError={(e) => e.target.src = '/fallback.png'} />
```

### 4.3 LanguageButton 완성
**현재 문제:** "나중에 toggle 로직으로 변경 예정" 주석만 있음

**개선 방안:** `react-i18next`로 실제 다국어 지원 구현

---

## 5. 부족한 기능

### 5.1 로딩 상태 구체화
**현재 문제:**
- 검색 결과 로딩 중 상태 없음
- 검색 결과 0개일 때 메시지 없음
- Suspense fallback 메시지 불명확

**개선 방안:**
```tsx
// 검색 결과 없음
{results.length === 0 && debouncedTerm && (
  <p>"{debouncedTerm}"에 대한 검색 결과가 없습니다.</p>
)}
```

### 5.2 접근성 (a11y)
**현재 문제:**
- SearchInput: screen reader 지원 부족
- 색상만으로 정보 전달 (배지 색상)
- 터치 타겟 44x44px 미만

**개선 방안:**
- `role`, `aria-label` 추가
- 색상 + 텍스트로 정보 전달
- 버튼/아이콘 크기 증가

### 5.3 테스트 코드
**현재 문제:** 테스트 파일 없음

**개선 방안:**
- Jest로 유닛 테스트
- Playwright/Cypress로 E2E 테스트

### 5.4 오프라인 지원
**현재 문제:** 인터넷 연결 필수

**개선 방안:** PWA (Service Worker)로 데이터 캐싱

---

## 우선순위 로드맵

| 순서 | 기능 | 난이도 | 소요시간 | 효과 |
|------|------|--------|---------|------|
| 1 | 찜하기 기능 | 낮음 | 2-3시간 | 높음 |
| 2 | 날짜 필터 | 낮음 | 3-4시간 | 높음 |
| 3 | 코드 중복 제거 | 낮음 | 1-2시간 | 중간 |
| 4 | 반응형 디자인 | 중간 | 4-5시간 | 높음 |
| 5 | 키보드 네비게이션 | 중간 | 3-4시간 | 중간 |
| 6 | 에러 처리 강화 | 낮음 | 2-3시간 | 중간 |
| 7 | 사용자 평가 | 중간 | 8-10시간 | 높음 |
| 8 | 마이 일정 캘린더 | 중간 | 6-8시간 | 중간 |
