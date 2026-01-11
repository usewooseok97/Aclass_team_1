# Aclass_team_1 프로젝트 리팩토링 가이드

> **목적**: Python 기반 데이터 파이프라인으로 전환하여 안정성과 확장성을 확보합니다.

---

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [현재 문제점](#현재-문제점)
3. [변경 아키텍처](#변경-아키텍처)
4. [리팩토링 계획](#리팩토링-계획)
5. [파일별 처리 방침](#파일별-처리-방침)
6. [구현 체크리스트](#구현-체크리스트)

---

## 프로젝트 개요

### 기술 스택
**Frontend**
- React 19.1.0 + Vite 6.3.5
- Bootstrap 5.3.6 + Tailwind CSS 3.4.1
- React Router 7.6.2

**Backend (축소)**
- Express.js 5.1.0 (리뷰 전용)
- Notion API 연동

**데이터 파이프라인 (신규)**
- Python 3.10+
- pandas, requests
- 서울시 API, 네이버 API, 기상청 API

### 주요 기능
- 서울 자치구별 축제 정보 제공
- 계절별 축제 필터링
- 실시간 날씨 정보
- **네이버 검색량 기반 관심도 점수**
- **실제 맛집 데이터**
- **Notion 기반 리뷰 시스템**

---

## 현재 문제점

### 🔴 치명적 문제

#### 1. 랜덤 평점 생성
**위치**: `src/utilFunction/festivalUtils.js:17`
```javascript
const randomRating = Math.floor(Math.random() * 5) * 0.5 + 3;
```
- 새로고침할 때마다 평점이 바뀜
- **해결**: 네이버 검색량 기반 관심도 점수로 대체

#### 2. 더미 데이터 의존
- `src/dataset/foodList.js`: 10개 하드코딩된 음식점
- `src/dataset/reviewsList.js`: 5개 고정 리뷰
- **해결**:
  - 음식점 → 네이버 지역검색 API (Python → JSON)
  - 리뷰 → Notion DB

#### 3. API 호출 제한
- AccuWeather API 호출 제한 (50회/일)
- 사용자 요청 시마다 API 호출 → 속도 저하
- **해결**: 기상청 API를 활용하고, Python이 주기적으로 데이터 수집하여 JSON 파일 생성

### 🟡 구조 문제

#### 4. Context 과부하
**위치**: `src/App.jsx:97-117`
- 16개 값을 하나의 Context에 전달
- Context 변경 시 모든 자식 리렌더링
- **해결**: DataContext / UIContext / FavoritesContext 분리

#### 5. favoriteTrigger anti-pattern
```javascript
const [favoriteTrigger, setFavoriteTrigger] = useState(0);
setFavoriteTrigger(prev => prev + 1); // 강제 리렌더링
```
- **해결**: Context 분리 + localStorage 배열 관리

---

## 변경 아키텍처

### 핵심 변경 사항

| 구분 | 변경 전 (AS-IS) | 변경 후 (TO-BE) |
| :--- | :--- | :--- |
| **데이터 수집** | 사용자 요청 시 프록시가 API 호출 | **Python 스크립트**가 주기적으로 JSON 생성 |
| **날씨 정보** | AccuWeather API (호출 제한) | **기상청 단기예보 API** (Python 수집) |
| **평점 시스템** | 랜덤 생성 | **네이버 블로그 검색량 기반 관심도** |
| **맛집 데이터** | 하드코딩 | **네이버 지역 검색 API** |
| **리뷰 시스템** | 더미 데이터 | **Notion API** |

### 데이터 흐름

```
┌─────────────────────────────────────────────────┐
│      Python Scripts (주기 실행)                  │
│                                                   │
│  main.py                                         │
│    ├─ festival.py: 서울시 API + 네이버 검색     │
│    │   → festival_data.json (관심도 점수 포함)  │
│    ├─ place.py: 네이버 지역검색                 │
│    │   → place_data.json (맛집/카페)            │
│    └─ weather.py: 기상청 API                     │
│        → weather_data.json                       │
└─────────────────────────────────────────────────┘
                      ↓ 파일 저장
┌─────────────────────────────────────────────────┐
│   Frontend/public/data/                          │
│     ├─ festival_data.json                        │
│     ├─ place_data.json                           │
│     └─ weather_data.json                         │
└─────────────────────────────────────────────────┘
                      ↓ fetch()
┌─────────────────────────────────────────────────┐
│              Frontend (React)                    │
│                                                   │
│  App.jsx                                         │
│    └─ fetch('/data/festival_data.json')         │
│                                                   │
│  Weather.jsx                                     │
│    └─ fetch('/data/weather_data.json')          │
│                                                   │
│  FoodNearby.jsx                                  │
│    └─ fetch('/data/place_data.json')            │
│                                                   │
│  ReviewBoard.jsx                                 │
│    └─ axios.get('/api/reviews/:title')          │
│         (프록시 서버 경유)                       │
└─────────────────────────────────────────────────┘
                      ↓ 리뷰만
┌─────────────────────────────────────────────────┐
│      weather-proxy (Express:5001)                │
│                                                   │
│  ✅ GET  /api/reviews/:title                     │
│  ✅ POST /api/reviews                            │
│                                                   │
│  ❌ 삭제: /api/weather                           │
│  ❌ 삭제: /api/festivals                         │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│         Notion API (리뷰 DB)                     │
└─────────────────────────────────────────────────┘
```

---

## 리팩토링 계획

### 🔴 1단계: Python 데이터 파이프라인 구축

#### 폴더 구조
```
py_scripts/
├── config.py              # API 키 관리
├── main.py                # 전체 실행 컨트롤러
├── requirements.txt       # 의존성
└── modules/
    ├── festival.py        # 축제 + 관심도
    ├── place.py           # 맛집/카페
    └── weather.py         # 날씨
```

#### 구현 내용

**1) config.py**
```python
SEOUL_API_KEY = "..."
NAVER_CLIENT_ID = "..."
NAVER_CLIENT_SECRET = "..."
KMA_API_KEY = "..."
SAVE_PATH = "../Aclass_team_1/public/data/"
```

**2) modules/festival.py**
```python
# 1. 서울시 축제 API 호출 (12개월)
# 2. 네이버 블로그 검색 API로 검색량 조회
# 3. 검색량 기반 관심도 점수 (0~100) 계산
# 4. festival_data.json 저장
```

**3) modules/place.py**
```python
# 1. festival_data.json에서 장소(GUNAME) 추출
# 2. 네이버 지역검색 API로 맛집/카페 조회
# 3. place_data.json 저장
```

**4) modules/weather.py**
```python
# 1. 기상청 단기예보 API 호출
# 2. 서울 현재 날씨 조회
# 3. weather_data.json 저장
```

**5) main.py**
```python
import modules.festival as festival
import modules.place as place
import modules.weather as weather

if __name__ == "__main__":
    festival.fetch_and_save()
    place.fetch_and_save()
    weather.fetch_and_save()
```

**결과물**
- `Aclass_team_1/public/data/festival_data.json`
- `Aclass_team_1/public/data/place_data.json`
- `Aclass_team_1/public/data/weather_data.json`

---

### 🔴 2단계: Backend 축소 (리뷰 전용)

#### 수정: weather-proxy/index.js

**삭제 대상**
```javascript
❌ app.get("/api/festivals", ...)
❌ app.get("/api/weather/:locationKey", ...)
```

**추가 대상**
```javascript
✅ GET  /api/reviews/:festivalTitle
✅ POST /api/reviews
```

#### 신규: weather-proxy/notionService.js

```javascript
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getReviews(festivalTitle) {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DB_ID,
    filter: {
      property: "festival_title",
      title: { equals: festivalTitle }
    }
  });
  return response.results;
}

export async function createReview(festivalTitle, userName, content, rating) {
  return await notion.pages.create({
    parent: { database_id: process.env.NOTION_DB_ID },
    properties: {
      festival_title: { title: [{ text: { content: festivalTitle } }] },
      user_name: { rich_text: [{ text: { content: userName } }] },
      content: { rich_text: [{ text: { content: content } }] },
      rating: { number: rating }
    }
  });
}
```

#### 환경 변수: weather-proxy/.env

```env
NOTION_API_KEY=your_notion_integration_key
NOTION_DB_ID=your_database_id
NODE_ENV=development
```

---

### 🔴 3단계: Frontend 수정

#### 수정: src/App.jsx

**변경 전**
```javascript
const response = await axios.get('http://localhost:5001/api/festivals');
setFestivalData(response.data);
```

**변경 후**
```javascript
const response = await fetch('/data/festival_data.json');
const data = await response.json();
setFestivalData(data);
```

#### 수정: src/Component/InnerList.jsx

**변경 전**
```javascript
<RatingStars rating={randomRating} />
```

**변경 후**
```javascript
<BuzzScore score={item.buzz_score} />  // 관심도 점수 표시
```

#### 수정: src/Component/FoodNearby.jsx

**변경 전**
```javascript
import { foodList } from '../dataset/foodList';
```

**변경 후**
```javascript
const [foods, setFoods] = useState([]);

useEffect(() => {
  fetch('/data/place_data.json')
    .then(res => res.json())
    .then(data => setFoods(data[festivalTitle] || []));
}, [festivalTitle]);
```

#### 수정: src/Component/ReviewBoard.jsx

**변경 전**
```javascript
import { reviewsList } from '../dataset/reviewsList';
```

**변경 후**
```javascript
const [reviews, setReviews] = useState([]);

useEffect(() => {
  axios.get(`/api/reviews/${festivalTitle}`)
    .then(res => setReviews(res.data));
}, [festivalTitle]);
```

#### 수정: src/services/axiosServices.jsx

**추가**
```javascript
export const getReviews = async (festivalTitle) => {
  const res = await axios.get(`${baseURL}/api/reviews/${festivalTitle}`);
  return res.data;
};

export const createReview = async (festivalTitle, userName, content, rating) => {
  const res = await axios.post(`${baseURL}/api/reviews`, {
    festivalTitle,
    userName,
    content,
    rating
  });
  return res.data;
};
```

---

### 🟡 4단계: Context 분리 (선택적 최적화)

#### 신규: src/contexts/DataContext.jsx
```javascript
// festivalData, topDistricts (읽기 전용)
export const DataContext = createContext();
```

#### 신규: src/contexts/UIContext.jsx
```javascript
// currentSeason, selectedDistrict, selectedFestival, sidebarVisible
export const UIContext = createContext();
```

#### 신규: src/contexts/FavoritesContext.jsx
```javascript
// favorites (배열), toggleFavorite
export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });

  const toggleFavorite = (title) => {
    setFavorites(prev => {
      const exists = prev.includes(title);
      const updated = exists
        ? prev.filter(t => t !== title)
        : [...prev, title];

      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
```

---

## 파일별 처리 방침

### ✅ 신규 생성

**Python Scripts**
- `py_scripts/config.py`
- `py_scripts/main.py`
- `py_scripts/requirements.txt`
- `py_scripts/modules/festival.py`
- `py_scripts/modules/place.py`
- `py_scripts/modules/weather.py`

**Data Files**
- `Aclass_team_1/public/data/festival_data.json`
- `Aclass_team_1/public/data/place_data.json`
- `Aclass_team_1/public/data/weather_data.json`

**Backend**
- `weather-proxy/notionService.js`

**Frontend (선택)**
- `src/contexts/DataContext.jsx`
- `src/contexts/UIContext.jsx`
- `src/contexts/FavoritesContext.jsx`

### 🔧 수정

**Backend**
- `weather-proxy/index.js` (리뷰 API만 남김)
- `weather-proxy/package.json` (`@notionhq/client` 추가)

**Frontend**
- `src/App.jsx` (JSON 파일 로드)
- `src/Component/InnerList.jsx` (관심도 표시)
- `src/Component/FoodNearby.jsx` (JSON 로드)
- `src/Component/ReviewBoard.jsx` (Notion 연동)
- `src/services/axiosServices.jsx` (리뷰 API 추가)

### ❌ 삭제

**Dataset**
- `src/dataset/foodList.js`
- `src/dataset/reviewsList.js`

**Pages**
- `src/pages/Test.jsx`

**Utils**
- `src/utilFunction/festivalUtils.js` 내 `randomRating` 함수

### ✅ 유지

**Components (변경 없음)**
- `Header.jsx`, `Weather.jsx`, `SeoulMap.jsx`
- `ImageMapper.jsx`, `SideBar.jsx`, `Footer.jsx`
- `FestivalInfo.jsx`, `FestivalSlider.jsx`
- `Seasonbutton.jsx`, `MyButton.jsx`, `InfoItem.jsx`

**Dataset (유지)**
- `seoulMapData.js`, `weatherIcon.jsx`, `imagesList.js`

**Pages (유지)**
- `MainPage.jsx`, `GalleryPage.jsx`, `NotFound.jsx`

---

## 구현 체크리스트

### 🔴 필수 작업

#### Python 데이터 파이프라인
- [ ] 네이버 검색/지역 API 키 발급
- [ ] 기상청 API 키 발급
- [ ] `py_scripts/` 폴더 구조 생성
- [ ] `config.py` 작성 (API 키)
- [ ] `modules/festival.py` 구현
- [ ] `modules/place.py` 구현
- [ ] `modules/weather.py` 구현
- [ ] `main.py` 작성
- [ ] 로컬에서 스크립트 실행 테스트
- [ ] JSON 파일 3개 생성 확인

#### Notion DB 설정
- [ ] Notion Integration 생성
- [ ] Festival_Reviews DB 생성 (컬럼: festival_title, user_name, content, rating, created_at)
- [ ] DB를 Integration에 연결
- [ ] `weather-proxy/.env`에 `NOTION_API_KEY`, `NOTION_DB_ID` 추가

#### Backend 수정
- [ ] `notionService.js` 작성
- [ ] `index.js`에 리뷰 API 추가
- [ ] `/api/festivals`, `/api/weather` 엔드포인트 삭제
- [ ] `@notionhq/client` 패키지 설치
- [ ] 에러 처리 추가

#### Frontend 수정
- [ ] `public/data/` 폴더 생성
- [ ] `App.jsx` → JSON 파일에서 축제 데이터 로드
- [ ] `festivalUtils.js` → `randomRating` 함수 제거
- [ ] `InnerList.jsx` → 관심도 표시로 변경
- [ ] `FoodNearby.jsx` → `place_data.json` 로드
- [ ] `ReviewBoard.jsx` → Notion API 연동
- [ ] `axiosServices.jsx` → 리뷰 API 함수 추가

#### 정리
- [ ] `src/dataset/foodList.js` 삭제
- [ ] `src/dataset/reviewsList.js` 삭제
- [ ] `src/pages/Test.jsx` 삭제
- [ ] 사용하지 않는 import 정리

### 🟡 선택 작업

#### Context 분리
- [ ] `DataContext.jsx` 생성
- [ ] `UIContext.jsx` 생성
- [ ] `FavoritesContext.jsx` 생성
- [ ] `App.jsx` Context 분리
- [ ] `favoriteTrigger` 제거

#### 자동화
- [ ] GitHub Actions workflow 작성 (주기적 데이터 수집)
- [ ] 로컬 Cron 설정 (또는 작업 스케줄러)

---

## 환경 변수 정리

### Python (.env 또는 config.py)
```env
SEOUL_API_KEY=your_seoul_api_key
NAVER_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
KMA_API_KEY=your_kma_api_key
```

### Backend (weather-proxy/.env)
```env
NOTION_API_KEY=your_notion_integration_key
NOTION_DB_ID=your_database_id
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_SEOUL_KEY=http://localhost:5001
VITE_BASE_URL=/Aclass_team_1
```

---

## 최종 폴더 구조

```
C:\Aclass_team_1\
├── Aclass_team_1\                    # Frontend
│   ├── public\
│   │   └── data\                     # ✅ 신규
│   │       ├── festival_data.json
│   │       ├── place_data.json
│   │       └── weather_data.json
│   ├── src\
│   │   ├── Component\                # 일부 수정
│   │   ├── pages\                    # 일부 수정
│   │   ├── contexts\                 # ✅ 신규 (선택)
│   │   ├── dataset\                  # 축소 (더미 제거)
│   │   ├── services\                 # 수정
│   │   └── ...
│   └── ...
│
├── weather-proxy\                    # Backend (축소)
│   ├── index.js                      # 🔧 수정 (리뷰만)
│   ├── notionService.js              # ✅ 신규
│   └── .env                          # 🔧 수정
│
└── py_scripts\                       # ✅ 신규
    ├── config.py
    ├── main.py
    ├── requirements.txt
    └── modules\
        ├── festival.py
        ├── place.py
        └── weather.py
```

---

## 참고 자료

### API 문서
- [서울 열린데이터 광장](https://data.seoul.go.kr/)
- [네이버 검색 API](https://developers.naver.com/docs/serviceapi/search/blog/blog.md)
- [네이버 지역 검색 API](https://developers.naver.com/docs/serviceapi/search/local/local.md)
- [기상청 단기예보 API](https://www.data.go.kr/data/15084084/openapi.do)
- [Notion API](https://developers.notion.com/)

---

## 핵심 요약

### 변경 전 (문제점)
- 사용자 요청 시마다 프록시 서버가 API 호출
- 랜덤 평점으로 데이터 일관성 없음
- 더미 데이터로 실제 정보 없음
- API 호출 제한 문제

### 변경 후 (개선)
- Python이 주기적으로 데이터 수집 → JSON 생성
- 네이버 검색량 기반 실제 관심도 점수
- 실제 맛집 데이터 + Notion 리뷰
- API 호출 제한 해결, 속도 향상

### 작업 순서
1. Python 스크립트 작성 및 JSON 생성
2. Notion DB 설정
3. Backend 축소 (리뷰 API만)
4. Frontend JSON/Notion 연동
5. 더미 데이터 삭제
6. (선택) Context 분리 최적화

**리팩토링 후 확장 가능하고 유지보수하기 쉬운 구조가 됩니다!**
