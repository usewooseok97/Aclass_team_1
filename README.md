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
- [개발 진행도](#개발-진행도)
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

### 프론트엔드

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
| **거리 계산** | geolib |
| **유틸리티** | clsx, tailwind-merge, class-variance-authority, dayjs |

### 백엔드

| 분야 | 기술 |
|------|------|
| **런타임** | Vercel Serverless Functions |
| **프레임워크** | Express.js (TypeScript) |
| **데이터베이스** | Supabase (PostgreSQL) |
| **인증** | JWT + bcryptjs |

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

### 사용자 인증
- 전화번호 + 비밀번호 로그인
- 회원가입 (닉네임, 전화번호, 비밀번호)
- 회원 탈퇴
- JWT 토큰 기반 인증

### 찜하기 기능
- 축제 카드 하트 아이콘
- 로그인 시 서버 동기화
- 비로그인 시 LocalStorage 저장
- "찜한 축제만 보기" 필터

### 축제 리뷰
- 칠판 스타일 리뷰 UI
- 별점 (1-5점) + 짧은 후기 (10자)
- 로그인 사용자만 작성 가능
- 축제 기간 동안만 유효

### 정렬/필터
- 날짜 필터 (전체/현재 진행중)
- 거리순 정렬 (위치 권한 필요)

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
├── vercel.json                # Vercel 배포 설정
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js
├── eslint.config.js
│
├── api/                       # 백엔드 API (Vercel Serverless)
│   ├── lib/
│   │   ├── supabase.ts        # Supabase 클라이언트
│   │   └── auth.ts            # JWT/bcrypt 유틸리티
│   ├── schema.sql             # DB 스키마
│   ├── auth/
│   │   ├── signup.ts          # 회원가입
│   │   ├── login.ts           # 로그인
│   │   ├── logout.ts          # 로그아웃
│   │   ├── me.ts              # 현재 사용자 정보
│   │   └── withdraw.ts        # 회원 탈퇴
│   ├── favorites/
│   │   ├── index.ts           # 찜 목록 조회
│   │   └── [festivalId].ts    # 찜 추가/삭제
│   └── reviews/
│       ├── [festivalId].ts    # 리뷰 조회/작성
│       └── delete/
│           └── [reviewId].ts  # 리뷰 삭제
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
    │   ├── ChalkboardComment.tsx # 칠판 댓글 표시
    │   ├── ContentsText.tsx
    │   ├── FilterButton.tsx      # 필터 버튼 원자 컴포넌트
    │   ├── FooterText.tsx
    │   ├── FullWidthCard.tsx
    │   ├── IconText.tsx
    │   ├── LanguageButton.tsx
    │   ├── LazyImage.tsx
    │   ├── Pictures.tsx
    │   ├── PlaceCard.tsx
    │   ├── SeasonButton.tsx
    │   ├── StarRating.tsx
    │   ├── TextLink.tsx          # 텍스트 링크 컴포넌트
    │   ├── TitleText.tsx
    │   └── backButton.tsx
    │
    ├── components/               # 합성 컴포넌트
    │   ├── AuthButton.tsx        # 헤더 로그인 버튼
    │   ├── AuthModal.tsx         # 로그인/회원가입 모달
    │   ├── ChalkboardInput.tsx   # 칠판 입력 폼
    │   ├── ErrorBoundary.tsx
    │   ├── FestivalCard.tsx
    │   ├── FestivalReviewSection.tsx # 축제 리뷰 섹션
    │   ├── FilterButtons.tsx     # 필터 버튼 그룹
    │   ├── GridButtonGroup.tsx
    │   ├── GridPictures.tsx
    │   ├── LoadingState.tsx
    │   ├── LoginForm.tsx         # 로그인 폼
    │   ├── RestaurantCard.tsx
    │   ├── SearchInput.tsx
    │   ├── SignupForm.tsx        # 회원가입 폼
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
    │   ├── NotFoundPage/
    │   │   └── NotFoundPage.tsx
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
    │   ├── AuthContext.tsx       # 인증 상태 관리
    │   ├── DataContext.tsx       # 데이터 로딩
    │   ├── FestivalContext.tsx   # 축제 컨텍스트 통합
    │   ├── FilterContext.tsx     # 필터/찜하기 상태
    │   └── NavigationContext.tsx # 네비게이션 상태
    │
    ├── hooks/
    │   ├── useFestivalContext.ts
    │   ├── useNaverMap.ts
    │   ├── useTimePhase.ts
    │   └── useUrlSync.ts
    │
    ├── utils/
    │   ├── distance.ts           # 거리 계산 유틸리티
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
    │   ├── chalkboard.ts         # 칠판 댓글 타입
    │   ├── festival.ts
    │   └── naverMap.d.ts
    │
    └── lib/
        ├── api.ts                # API 클라이언트
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
| `FilterButton` | 필터 버튼 | `isActive`, `onClick`, `disabled` |
| `TextLink` | 텍스트 링크 | `onClick`, `children` |
| `ChalkboardComment` | 칠판 댓글 | `comment` |

### Components (합성 컴포넌트)

| 컴포넌트 | 설명 |
|----------|------|
| `FestivalCard` | 축제 카드 (제목, 평점, 찜하기, 호버 애니메이션) |
| `RestaurantCard` | 음식점 카드 (이미지, 카테고리, 길찾기) |
| `SearchInput` | 검색 입력 (드롭다운, 키보드 네비게이션, ARIA) |
| `FilterButtons` | 필터 버튼 그룹 (날짜, 찜하기, 정렬) |
| `AuthButton` | 헤더 로그인/사용자 버튼 |
| `AuthModal` | 로그인/회원가입 모달 |
| `FestivalReviewSection` | 축제 리뷰 섹션 (칠판 스타일) |
| `ChalkboardInput` | 칠판 입력 폼 |
| `ErrorBoundary` | 에러 바운더리 |
| `LoadingState` | 로딩 스피너 |
| `WeatherLocation` | 날씨 정보 표시 |

### Containers (스마트 컴포넌트)

| 컴포넌트 | 설명 |
|----------|------|
| `SeoulMapContainer` | 서울 SVG 지도 (25개 자치구 인터랙션) |
| `FestivalListContainer` | 축제 목록 컨테이너 (거리 계산, 정렬) |
| `GuButtonContainer` | 자치구 선택 버튼 |
| `HeaderContainer` | 헤더 (날씨, 검색, 로그인, 시간 배경) |
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
  CODENAME: string;         // 축제 ID
  DATE: string;             // 기간
  STRTDATE: string;         // 시작일 (YYYYMMDD)
  END_DATE: string;         // 종료일 (YYYYMMDD)
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

### User (사용자)

```typescript
interface User {
  id: number;               // 고유번호 (SERIAL)
  nickname: string;         // 닉네임
  phone: string;            // 전화번호 (로그인 ID)
  createdAt?: string;       // 가입일
}
```

### Review (리뷰)

```typescript
interface Review {
  id: number;               // 리뷰 ID
  text: string;             // 내용 (최대 10자)
  rating: number;           // 별점 (1-5)
  x: number;                // 칠판 X 좌표
  y: number;                // 칠판 Y 좌표
  fontSize: number;         // 폰트 크기
  rotate: number;           // 회전 각도
  color: string;            // 분필 색상
  createdAt: string;        // 작성일
  userName: string;         // 작성자 닉네임
}
```

---

## Architecture

### 데이터 흐름

```
main.tsx (root)
  └─ ErrorBoundary
      └─ AuthProvider (인증 상태)
          └─ FestivalProvider (축제 데이터 + 필터 + 네비게이션)
              └─ App
                  └─ AppContent
                      ├─ HeaderContainer
                      │   ├─ TimetoScrolling (시간대별 배경)
                      │   ├─ WeatherLocation
                      │   ├─ SearchInput
                      │   └─ AuthButton
                      ├─ LeftSectionContainer
                      │   ├─ LeftContent (지도 + 축제 정보)
                      │   └─ LeftContentDetail (상세 + 리뷰)
                      ├─ RightSectionContainer
                      │   ├─ RightContent (축제 목록 + 필터)
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
6. 로그인 → AuthButton → AuthModal → AuthContext → 서버 동기화
7. 찜하기 → FestivalCard → FilterContext → API/localStorage
8. 리뷰 작성 → FestivalReviewSection → API
```

### 백엔드 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    Vercel                           │
│  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │  React + Vite   │  │  Express.js (Serverless)│  │
│  │  (Static)       │  │  /api/auth/*            │  │
│  │                 │  │  /api/favorites/*       │  │
│  │                 │  │  /api/reviews/*         │  │
│  └─────────────────┘  └───────────┬─────────────┘  │
└───────────────────────────────────┼─────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │         Supabase              │
                    │  ┌─────────────────────────┐  │
                    │  │      PostgreSQL         │  │
                    │  │  - users (전화번호 인증) │  │
                    │  │  - favorites            │  │
                    │  │  - reviews              │  │
                    │  └─────────────────────────┘  │
                    └───────────────────────────────┘
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

## 개발 진행도

### 2026년 1월 (초기 개발)

| 날짜 | 작업 내용 |
|------|----------|
| 1월 5일 | 프로젝트 초기 설정, 컨테이너 구조 설계 |
| 1월 6-7일 | 헤더, 카드, 그리드 컴포넌트 구현 |
| 1월 8일 | 시간대별 테마 시스템 구현 (아침/낮/석양/밤) |
| 1월 10일 | 날씨/검색/스크롤링 컴포넌트 |
| 1월 11일 | 프로젝트 문서화 |
| 1월 12일 | FestivalContext 전역 상태 관리, App.tsx 대규모 리팩토링 |
| 1월 14일 | 로딩 상태 구현 |
| 1월 19일 | 프로젝트 구조 마이그레이션 |
| 1월 20-22일 | 다이내믹 헤더, 상세페이지 구현, CardLayout 작업 |

### 2026년 2월 (기능 확장)

#### Phase 1: 핵심 기능 ✅ 완료
- [x] 날짜 필터 기능 (전체/현재 진행중)
- [x] 찜하기/위시리스트 기능 (LocalStorage)

#### Phase 2: 추가 기능 ✅ 완료
- [x] 거리 표시 기능 (geolib + useGeolocation)
- [x] 사용자 평가/후기 기능 (칠판 스타일)

#### Phase 3-5: 백엔드 연동 ✅ 완료
- [x] Express.js + Vercel Serverless Functions 설정
- [x] Supabase PostgreSQL 데이터베이스 스키마
- [x] 사용자 인증 API (전화번호 + 비밀번호)
  - signup, login, logout, me, withdraw
- [x] 찜하기 API 연동
  - GET/POST/DELETE /api/favorites
- [x] 리뷰 API 연동
  - GET/POST /api/reviews, DELETE /api/reviews/delete
- [x] 프론트엔드 AuthContext 구현
- [x] 프론트엔드 인증 UI (모달 방식)
- [x] FilterContext 서버 동기화
- [x] FestivalReviewSection 서버 연동

#### Phase 6: 배포 ⏳ 대기
- [ ] Vercel 환경변수 설정
- [ ] Supabase 프로덕션 설정
- [ ] 프로덕션 배포

---

## 추후 개발 사항

### 완료된 기능
- [x] 축제 즐겨찾기 기능 (찜하기)
- [x] 사용자 리뷰 기능
- [x] 필터링 기능 (날짜, 찜하기)
- [x] 거리 기반 정렬 (가까운 순)
- [x] 사용자 인증 (회원가입/로그인/탈퇴)

### 예정된 기능
- [ ] 다국어 지원 (영어, 중국어, 일본어)
- [ ] PWA 지원 (오프라인 모드)
- [ ] 축제 알림 기능
- [ ] 소셜 공유 기능 확장
- [ ] 축제 캘린더 뷰
- [ ] 계절/무료/유료 필터 추가
- [ ] 리뷰 수정 기능
- [ ] 프로필 수정 기능

---

## 라이센스

Copyright © 2026 Seoul Festival Map

---
