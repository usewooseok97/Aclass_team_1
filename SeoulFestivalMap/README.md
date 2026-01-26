# Seoul Festival Map (서울 축제 지도)

## 목차
- [목표](#목표)
- [코드 품질 관리](#코드-품질-관리)
- [기술 스택](#기술-스택)
- [기능](#기능)
- [개발환경 및 배포](#개발환경-및-배포)
- [URL 구조](#url-구조)
- [프로젝트 구조](#프로젝트-구조)
- [컴포넌트 가이드](#컴포넌트-가이드)
- [데이터 구조](#데이터-구조)
- [Architecture](#architecture)
- [화면 설계](#화면-설계)
- [최적화 사항](#최적화-사항)
- [에러와 에러 해결](#에러와-에러-해결)
- [추후 개발 사항](#추후-개발-사항)

---

## 목표

### 서울 축제 정보 서비스

서울 축제 지도는 서울시에서 열리는 **모든 축제 정보**를 한눈에 볼 수 있는 서비스입니다.

사용자는 서울 지도에서 자치구를 선택하여 해당 지역의 축제를 탐색하고, 축제 상세 정보와 주변 맛집까지 확인할 수 있습니다.

---

> **배포 URL** : (배포 후 URL 추가 예정)

---

## 코드 품질 관리

이 프로젝트는 **Prettier**와 **ESLint**를 사용하여 코드 품질을 관리합니다.

### 자동 포맷팅

VSCode에서 파일을 저장하면 자동으로 Prettier가 실행됩니다.

```bash
# 린트 검사
npm run lint

# 빌드
npm run build
```

---

## 기술 스택

| 분야 | 기술 |
|------|------|
| **프레임워크** | React 19 |
| **언어** | TypeScript |
| **빌드 도구** | Vite |
| **스타일링** | Tailwind CSS 4 |
| **애니메이션** | Motion (Framer Motion) |
| **아이콘** | Lucide React |
| **상태관리** | React Context API |
| **지도 API** | Naver Maps API |
| **장소 API** | Google Places API |
| **유틸리티** | clsx, tailwind-merge, class-variance-authority |

---

## 기능

### 지도 기반 탐색
- 서울시 25개 자치구 인터랙티브 SVG 지도
- 자치구 클릭 시 해당 지역 축제 목록 표시
- 호버 시 자치구 하이라이트 효과

### 축제 검색
- 축제명, 장소명, 자치구명으로 검색
- 맛집 이름, 카테고리로 검색
- 키보드 네비게이션 지원 (Arrow Up/Down, Enter, Escape)
- 실시간 검색 결과 드롭다운

### 축제 상세 정보
- 축제 기본 정보 (기간, 장소, 주최, 입장료 등)
- 축제 프로그램 설명
- 네이버 지도 연동 (오시는 길)
- 주변 맛집 정보 (카테고리별 표시)
- 맛집 → 축제 장소 길찾기 연동

### 시간대별 테마
- 아침 (06:00-09:00): 주황색 그라디언트
- 낮 (09:00-16:00): 파란색 그라디언트
- 저녁 (16:00-18:00): 자주색 그라디언트
- 밤 (18:00-06:00): 짙은 남색 그라디언트
- 해/달 위치 실시간 변경

### 날씨 정보
- 현재 온도 및 날씨 상태
- 최고/최저 기온 예보

---

## 개발환경 및 배포

### 개발 환경

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프리뷰
pnpm preview
```


### Commit 메시지 규칙

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새로운 기능 추가 | `feat: 검색 기능 구현` |
| `fix` | 버그 수정 | `fix: 지도 마커 오류 수정` |
| `style` | 스타일 변경 (UI/CSS) | `style: 카드 디자인 변경` |
| `refactor` | 코드 리팩토링 | `refactor: Context 구조 개선` |
| `docs` | 문서 수정 | `docs: README 업데이트` |
| `chore` | 기타 변경사항 | `chore: 패키지 업데이트` |

---

## URL 구조

### 뷰 모드

| 모드 | 설명 |
|------|------|
| `map` | 서울 지도 + 메인 콘텐츠 |
| `list` | 선택된 자치구의 축제 목록 |
| `detail` | 축제 상세 페이지 + 지도 |

### 상태 흐름

```
map (초기 상태)
  ↓ 자치구 클릭
list (축제 목록)
  ↓ 축제 카드 클릭
detail (축제 상세)
  ↓ 뒤로가기
list or map
```

---

## 프로젝트 구조

```
SeoulFestivalMap/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js
├── eslint.config.js
│
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── data/
│       ├── festival_data.json
│       ├── place_data.json
│       └── weather_data.json
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    │
    ├── assets/
    │   ├── mainBackground.png
    │   └── *.svg
    │
    ├── atoms/                    # 기본 UI 컴포넌트
    │   ├── Badge.tsx
    │   ├── CardLayout.tsx
    │   ├── ContentsText.tsx
    │   ├── FooterText.tsx
    │   ├── FullWidthCard.tsx
    │   ├── IconText.tsx
    │   ├── LanguageButton.tsx
    │   ├── LazyImage.tsx
    │   ├── Pictures.tsx
    │   ├── PlaceCard.tsx
    │   ├── SeasonButton.tsx
    │   ├── StarRating.tsx
    │   ├── TitleText.tsx
    │   └── backButton.tsx
    │
    ├── components/               # 합성 컴포넌트
    │   ├── ErrorBoundary.tsx
    │   ├── FestivalCard.tsx
    │   ├── GridButtonGroup.tsx
    │   ├── GridPictures.tsx
    │   ├── LoadingState.tsx
    │   ├── RestaurantCard.tsx
    │   ├── SearchInput.tsx
    │   ├── TimetoScrolling.tsx
    │   └── WeatherLocation.tsx
    │
    ├── containers/               # 컨테이너 컴포넌트
    │   ├── FestivalListContainer.tsx
    │   ├── FooterContainer.tsx
    │   ├── GuButtonContainer.tsx
    │   ├── HeaderContainer.tsx
    │   ├── LeftContent.tsx
    │   ├── LeftContentDetail.tsx
    │   ├── LeftSectionContainer.tsx
    │   ├── RightContent.tsx
    │   ├── RightContentDetail.tsx
    │   ├── RightSectionContainer.tsx
    │   └── SeoulMapContainer.tsx
    │
    ├── pages/
    │   └── FestivalDetailPage/
    │       ├── DetailPageHeader.tsx
    │       ├── FestivalActionButtons.tsx
    │       ├── FestivalBasicInfo.tsx
    │       ├── FestivalDescription.tsx
    │       ├── FestivalDetailHeader.tsx
    │       ├── FestivalDetailInfo.tsx
    │       ├── FestivalImageGallery.tsx
    │       ├── FestivalLocationMap.tsx
    │       └── NearbyRestaurants.tsx
    │
    ├── contexts/
    │   └── FestivalContext.tsx
    │
    ├── hooks/
    │   ├── useFestivalContext.ts
    │   ├── useNaverMap.ts
    │   └── useTimePhase.ts
    │
    ├── utils/
    │   ├── googlePlaces.ts
    │   ├── naverMap.ts
    │   ├── styles.ts
    │   └── theme.ts
    │
    ├── constants/
    │   ├── guData.ts
    │   ├── textConstants.ts
    │   └── WeatherIcons.ts
    │
    ├── types/
    │   ├── festival.ts
    │   └── naverMap.d.ts
    │
    └── lib/
        └── utils.ts
```

---

## 컴포넌트 가이드

### Atoms (기본 UI 컴포넌트)

| 컴포넌트 | 설명 | Props |
|----------|------|-------|
| `Badge` | 배지 컴포넌트 | `text`, `variant` (pink, purple, blue, green, orange) |
| `StarRating` | 별점 표시 | `rating`, `showNumber`, `reviewCount`, `size` |
| `Pictures` | 이미지 컴포넌트 | `backgroundImg`, `alt` |
| `LazyImage` | 지연 로딩 이미지 | `src`, `alt`, `placeholder` |
| `IconText` | 아이콘 + 텍스트 | `icon`, `text` |

### Components (합성 컴포넌트)

| 컴포넌트 | 설명 |
|----------|------|
| `FestivalCard` | 축제 카드 (제목, 평점, 호버 애니메이션) |
| `RestaurantCard` | 음식점 카드 (이미지, 카테고리, 길찾기) |
| `SearchInput` | 검색 입력 (드롭다운, 키보드 네비게이션, ARIA) |
| `ErrorBoundary` | 에러 바운더리 |
| `LoadingState` | 로딩 스피너 |
| `WeatherLocation` | 날씨 정보 표시 |

### Containers (스마트 컴포넌트)

| 컴포넌트 | 설명 |
|----------|------|
| `SeoulMapContainer` | 서울 SVG 지도 (25개 자치구 인터랙션) |
| `FestivalListContainer` | 축제 목록 컨테이너 |
| `GuButtonContainer` | 자치구 선택 버튼 |
| `HeaderContainer` | 헤더 (날씨, 검색, 시간 배경) |
| `LeftContent` / `RightContent` | 메인 콘텐츠 영역 |
| `LeftContentDetail` / `RightContentDetail` | 상세 페이지 콘텐츠 |

---

## 데이터 구조

### Festival (축제)

```typescript
interface Festival {
  season: "봄" | "여름" | "가을" | "겨울";
  GUNAME: string;           // 자치구명 (예: "강남구")
  TITLE: string;            // 축제명
  DATE: string;             // 기간
  PLACE: string;            // 개최 장소
  ORG_NAME: string;         // 주최자
  USE_TRGT: string;         // 이용대상
  MAIN_IMG: string;         // 대표 이미지 URL
  IS_FREE: "무료" | "유료";
  HMPG_ADDR: string;        // 홈페이지
  PROGRAM: string;          // 프로그램 설명
  buzz_score: number;       // 관심도 (0-100)
  mapx?: string;            // 경도
  mapy?: string;            // 위도
}
```

### Place (맛집)

```typescript
interface Place {
  name: string;             // 상호명
  category: string;         // 카테고리 (한식, 카페, 중식 등)
  address: string;          // 주소
  roadAddress: string;      // 도로명 주소
  mapx: string;             // 경도
  mapy: string;             // 위도
  telephone: string;        // 전화번호
  link: string;             // 네이버 링크
  googlePlaceId?: string;   // Google Places ID
  photos?: PlacePhoto[];    // 사진 정보
}
```

### Weather (날씨)

```typescript
interface Weather {
  lastUpdated: string;
  current: {
    temperature: number;
    sky: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: {
    maxTemp: number;
    minTemp: number;
    sky: string;
  };
}
```

---

## Architecture

### 데이터 흐름

```
App.tsx (root)
  └─ ErrorBoundary
      └─ FestivalProvider (Context)
          ├─ Load: festival_data.json, place_data.json, weather_data.json
          └─ AppContent
              ├─ HeaderContainer
              │   ├─ TimetoScrolling (시간대별 배경)
              │   ├─ WeatherLocation
              │   └─ SearchInput
              ├─ LeftSectionContainer
              │   ├─ LeftContent (지도 + 축제 정보)
              │   └─ LeftContentDetail (상세 페이지)
              ├─ RightSectionContainer
              │   ├─ RightContent (축제 목록)
              │   └─ RightContentDetail (상세 정보)
              ├─ FestivalLocationMap (네이버 지도)
              └─ FooterContainer
```

### 상호작용 흐름

```
1. 지도 클릭 → SeoulMapContainer → setSelectedDistrict() → viewMode: 'list'
2. 축제 검색 → SearchInput → navigateToDetail() → viewMode: 'detail'
3. 축제 카드 클릭 → FestivalCard → navigateToDetail() → viewMode: 'detail'
4. 뒤로가기 → BackButton → navigateBack() → viewMode: 이전 상태
5. 시간 변경 → useTimePhase() → 테마/배경 자동 변경
```

---

## 화면 설계

| 메인 페이지 | 축제 목록 |
|:---:|:---:|
| ![메인페이지](./readmeImg/main.png) | ![축제목록](./readmeImg/list.png) |

| 축제 상세 | 지도 |
|:---:|:---:|
| ![축제상세](./readmeImg/detail.png) | ![지도](./readmeImg/map.png) |

| 모바일 뷰 | 야간 테마 |
|:---:|:---:|
| ![모바일](./readmeImg/mobile.png) | ![야간](./readmeImg/night.png) |

---

## 최적화 사항

### SEO 최적화
- [x] `lang="ko"` 설정
- [x] 메타태그 추가 (description, keywords, author)
- [x] Open Graph 태그 (Facebook, KakaoTalk)
- [x] Twitter Card 태그
- [x] robots.txt 생성
- [x] sitemap.xml 생성

### 웹접근성 (a11y)
- [x] 버튼 aria-label, aria-pressed 추가
- [x] 검색 입력 키보드 네비게이션 (Arrow, Enter, Escape)
- [x] 검색 결과 role="listbox", role="option" 적용
- [x] 이미지 alt 속성 추가
- [x] focus-visible 스타일 추가
- [x] 별점 role="img", aria-label 추가

### 성능 최적화
- [x] 코드 스플리팅 (lazy import)
- [x] Suspense 적용
- [x] 이미지 lazy loading
- [x] 컴포넌트 메모이제이션 (React.memo)
- [x] 불필요한 패키지 제거 (react-icons)

### 코드 품질
- [x] ErrorBoundary 추가
- [x] 타입 정의 완비
- [x] 스타일 유틸리티 분리

---

## 에러와 에러 해결

### 네이버 지도 스크립트 로드 실패

**발생상황**
네이버 지도가 간헐적으로 로드되지 않는 문제

**원인**
스크립트 중복 로드 및 비동기 타이밍 이슈

**해결**
`loadNaverMapScript()` 함수에서 스크립트 존재 여부 체크 및 Promise 기반 로드 처리

---

### 축제 좌표 매핑 실패

**발생상황**
일부 축제가 지도에 표시되지 않음

**원인**
축제 데이터에 좌표 정보(mapx, mapy) 누락

**해결**
기본 데이터 생성 로직 추가, 좌표 없는 경우 자치구 중심 좌표 사용

---

### 검색 드롭다운 포커스 이탈

**발생상황**
키보드로 검색 결과 탐색 중 포커스가 사라짐

**원인**
외부 클릭 이벤트가 키보드 이벤트와 충돌

**해결**
`highlightedIndex` 상태 추가, 키보드 네비게이션 핸들러 분리

---

## 추후 개발 사항

- [ ] 축제 즐겨찾기 기능
- [ ] 사용자 리뷰 기능
- [ ] 다국어 지원 (영어, 중국어, 일본어)
- [ ] PWA 지원 (오프라인 모드)
- [ ] 축제 알림 기능
- [ ] 소셜 공유 기능 확장
- [ ] 축제 캘린더 뷰
- [ ] 필터링 기능 (계절, 무료/유료, 카테고리)

---

## 라이센스

Copyright © 2025 Seoul Festival Map

---
