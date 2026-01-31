# 라우팅 기능 구현 계획

## 목표
URL 기반 라우팅 추가: `domain/지역구/축제명`
- `/` → 메인 지도 화면
- `/강남구` → 강남구 축제 리스트
- `/강남구/서울봄축제` → 축제 상세 페이지

---

## 구현 순서

### 1. react-router-dom 설치
```bash
npm install react-router-dom
```

### 2. URL 유틸리티 생성
**새 파일:** `src/utils/urlUtils.ts`
- 한글 URL 인코딩/디코딩 함수
- 유효 지역구 검증 함수

```typescript
// 축제 제목 URL 인코딩
export const encodeFestivalTitle = (title: string): string => {
  return encodeURIComponent(title);
};

// 축제 제목 URL 디코딩
export const decodeFestivalTitle = (encoded: string): string => {
  return decodeURIComponent(encoded);
};

// 지역구 URL 인코딩
export const encodeDistrict = (district: string): string => {
  return encodeURIComponent(district);
};

// 지역구 URL 디코딩
export const decodeDistrict = (encoded: string): string => {
  return decodeURIComponent(encoded);
};

// 유효한 서울 지역구 목록
export const VALID_DISTRICTS = [
  '강서구', '양천구', '영등포구', '구로구', '금천구', '동작구', '관악구',
  '서초구', '강남구', '송파구', '강동구', '마포구', '서대문구', '종로구',
  '중구', '용산구', '은평구', '성북구', '동대문구', '성동구', '도봉구',
  '노원구', '중랑구', '광진구', '강북구'
];

export const isValidDistrict = (district: string): boolean => {
  return VALID_DISTRICTS.includes(district);
};
```

### 3. URL 동기화 훅 생성
**새 파일:** `src/hooks/useUrlSync.ts`
- URL ↔ FestivalContext 상태 양방향 동기화
- URL 파라미터 변경 감지 → 상태 업데이트
- 상태 변경 → URL 업데이트

```typescript
import { useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFestivalContext } from './useFestivalContext';
import {
  decodeDistrict,
  decodeFestivalTitle,
  encodeDistrict,
  encodeFestivalTitle,
  isValidDistrict
} from '@utils/urlUtils';

export const useUrlSync = () => {
  const { district, festivalTitle } = useParams<{
    district?: string;
    festivalTitle?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    selectedDistrict,
    selectedFestival,
    viewMode,
    allFestivals,
    setSelectedDistrict,
    setSelectedFestival,
    setViewMode,
  } = useFestivalContext();

  const isInitialMount = useRef(true);
  const isUrlDriven = useRef(false);

  // URL -> State 동기화 (마운트 및 URL 변경 시)
  useEffect(() => {
    if (!allFestivals.length) return; // 데이터 로드 대기

    isUrlDriven.current = true;

    const decodedDistrict = district ? decodeDistrict(district) : null;
    const decodedFestival = festivalTitle ? decodeFestivalTitle(festivalTitle) : null;

    if (decodedDistrict && isValidDistrict(decodedDistrict)) {
      if (decodedFestival) {
        // 제목과 지역구로 축제 찾기
        const festival = allFestivals.find(
          f => f.TITLE === decodedFestival && f.GUNAME === decodedDistrict
        );
        if (festival) {
          setSelectedDistrict(decodedDistrict);
          setSelectedFestival(festival);
          setViewMode('detail');
        } else {
          // 축제 없으면 지역구 리스트로 폴백
          setSelectedDistrict(decodedDistrict);
          setViewMode('list');
        }
      } else {
        // URL에 지역구만 있음
        setSelectedDistrict(decodedDistrict);
        setViewMode('list');
      }
    } else if (location.pathname === '/') {
      // 루트 경로 - 지도 표시
      setSelectedDistrict(null);
      setSelectedFestival(null);
      setViewMode('map');
    }

    isUrlDriven.current = false;
  }, [district, festivalTitle, allFestivals]);

  // State -> URL 동기화 (사용자 인터랙션으로 상태 변경 시)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isUrlDriven.current) return; // URL에서 변경된 경우 스킵

    let targetPath = '/';

    if (viewMode === 'detail' && selectedFestival && selectedDistrict) {
      targetPath = `/${encodeDistrict(selectedDistrict)}/${encodeFestivalTitle(selectedFestival.TITLE)}`;
    } else if ((viewMode === 'list' || viewMode === 'map') && selectedDistrict) {
      targetPath = `/${encodeDistrict(selectedDistrict)}`;
    }

    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: false });
    }
  }, [viewMode, selectedDistrict, selectedFestival?.TITLE]);

  return { navigate };
};
```

### 4. main.tsx 수정
**파일:** `src/main.tsx`
- `RouterProvider` 추가
- 라우트 정의: `/`, `/:district`, `/:district/:festivalTitle`

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';

이거 형식으로 하셈
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // 부모 Layout 컴포넌트
    errorElement: <NotFoundPage />, // 404 에러 처리
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      // 정의되지 않은 모든 경로가 NotFoundPage로 렌더링됨
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

### 5. App.tsx 수정
**파일:** `src/App.tsx`
- `AppContent`에 `useUrlSync()` 훅 추가

```tsx
// import 추가
import { useUrlSync } from '@hooks/useUrlSync';

const AppContent = () => {
  const { viewMode, selectedFestival } = useFestivalContext();
  const { phase } = useTimePhase();

  // URL 동기화 추가
  useUrlSync();

  // ... 나머지 코드 동일
};
```

### 6. FestivalListContainer.tsx 수정
**파일:** `src/containers/FestivalListContainer.tsx`
- 60번 라인: `setSelectedFestival` → `navigateToDetail` 변경

```tsx
// 변경 전
const { filteredFestivals, setSelectedFestival, selectedDistrict } = useFestivalContext();
// ...
onClick={() => setSelectedFestival(festival)}

// 변경 후
const { filteredFestivals, navigateToDetail, selectedDistrict } = useFestivalContext();
// ...
onClick={() => navigateToDetail(festival)}
```

---

## 수정 파일 목록

| 파일 | 변경 내용 |
|------|----------|
| `src/main.tsx` | RouterProvider 추가 |
| `src/App.tsx` | useUrlSync 훅 호출 |
| `src/containers/FestivalListContainer.tsx` | navigateToDetail 사용 |
| `src/utils/urlUtils.ts` | **신규** - URL 인코딩 유틸 |
| `src/hooks/useUrlSync.ts` | **신규** - URL 동기화 훅 |

---

## URL 예시

| 상태 | URL |
|------|-----|
| 메인 지도 | `/` |
| 강남구 리스트 | `/강남구` |
| 축제 상세 | `/강남구/서울봄축제` |
| 공백 포함 | `/강남구/2025%20서울%20재즈%20페스티벌` |

---

## 검증 방법

1. `npm run dev` 실행
2. 테스트 시나리오:
   - `/` 접속 → 지도 화면 표시
   - 지역구 클릭 → URL `/강남구`로 변경, 리스트 표시
   - 축제 카드 클릭 → URL `/강남구/축제명`으로 변경, 상세 페이지 표시
   - 뒤로가기 버튼 → 이전 URL로 복귀
   - 브라우저 새로고침 → 현재 URL 상태 유지
   - 직접 URL 입력 → 해당 페이지로 이동 (딥링크)
   - 잘못된 지역구 URL → 404페이지로 이동
