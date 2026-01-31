# ESLint 오류 수정 내역

## 수정일: 2026-01-31

## 수정 파일
- `src/hooks/useNaverMap.ts`
- `src/components/SearchInput.tsx`

---

## 1. useCallback 의존성 수정 (useNaverMap.ts)

### 오류
```
react-hooks/preserve-manual-memoization
Compilation Skipped: Existing memoization could not be preserved
```

### 원인
React Compiler가 `festival` 전체를 의존성으로 추론했는데, 수동으로 `[festival?.mapx, festival?.mapy]`를 지정하여 불일치 발생.

컴파일러는 함수 내부에서 `festival.mapx`, `festival.mapy` 외에도 `festival` 객체 자체에 접근하는 것을 감지하여 더 넓은 의존성을 추론함.

### 해결
```ts
// Before
}, [festival?.mapx, festival?.mapy]);

// After
}, [festival]);
```

### 왜 이렇게 수정했나?
- React Compiler의 추론을 따르는 것이 최적화에 유리
- `festival` 객체가 변경되면 지도 중심도 변경되어야 하므로 논리적으로도 타당
- 세밀한 의존성 지정보다 안정적인 동작이 더 중요

---

## 2. useEffect 내 동기적 setState 제거 (useNaverMap.ts)

### 오류
```
react-hooks/set-state-in-effect
Error: Calling setState synchronously within an effect can trigger cascading renders
```

### 원인
`useEffect` 바디에서 직접 `setError()`, `setIsLoading()` 호출:

```ts
useEffect(() => {
  if (!clientId) {
    setError("...");      // 동기적 setState
    setIsLoading(false);  // 동기적 setState
    return;
  }
  setIsLoading(true);     // 동기적 setState
  setError(null);         // 동기적 setState
  // ...
}, []);
```

이렇게 하면:
1. 렌더링 완료 → effect 실행 → setState → 리렌더링
2. **Cascading render** 발생으로 성능 저하

### 해결
초기 상태를 `useState` 기본값으로 설정하여 effect 외부에서 처리:

```ts
// hook 최상단에서 검증
const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;
const isValidClientId = !!(clientId && clientId !== "여기에_NCP_클라이언트_ID_입력");

// 초기 상태를 검증 결과에 따라 설정
const [isLoading, setIsLoading] = useState(isValidClientId);
const [error, setError] = useState<string | null>(
  isValidClientId ? null : "네이버 지도 API 키가 설정되지 않았습니다."
);

// effect에서는 비동기 콜백에서만 setState
useEffect(() => {
  if (!isValidClientId) return;

  loadNaverMapScript(clientId)
    .then(() => { /* setState here is OK - async callback */ })
    .catch((err) => { /* setState here is OK - async callback */ });
}, [isValidClientId, clientId, initMap, clearMarkers]);
```

### 왜 이렇게 수정했나?
- effect 바디의 동기적 setState는 불필요한 리렌더를 유발
- 초기 상태는 렌더링 시점에 결정 가능하므로 `useState` 기본값으로 처리
- Promise 콜백 내 setState는 비동기이므로 허용됨

---

## 3. useMemo로 파생 상태 계산 (SearchInput.tsx)

### 오류
```
react-hooks/set-state-in-effect
Error: Calling setState synchronously within an effect can trigger cascading renders
```

### 원인
검색 결과(`results`)를 `useEffect` + `useState`로 관리:

```ts
const [results, setResults] = useState([]);

useEffect(() => {
  setResults(searchResults);  // 동기적 setState
}, [debouncedTerm]);
```

### 해결
`results`는 `debouncedTerm`에서 파생되는 값이므로 `useMemo`로 계산:

```ts
const results = useMemo(() => {
  if (!debouncedTerm.trim()) return [];
  // 검색 로직...
  return searchResults;
}, [debouncedTerm, allFestivals, allPlaces]);
```

### 왜 이렇게 수정했나?
- 파생 상태는 effect가 아닌 렌더링 중에 계산하는 것이 React 권장 패턴
- 불필요한 리렌더 제거 (2번 → 1번)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) 참고

---

## 참고 자료
- [React Docs: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React Compiler](https://react.dev/learn/react-compiler)
