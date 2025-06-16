import { useEffect, useMemo, useReducer, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { InnerList } from "./InnerList";
import { generatePageNumbers } from "../utilFunction/festivalUtils";

const initialState = {
  currentPage: 1,
  itemsPerPage: 8,
  totalPages: 1,
};

function reducer(state, action) {   // 페이지 상태관리 reducer
  switch (action.type) {
    case "SET_TOTAL":
      return {
        ...state,
        totalPages: Math.ceil(action.payload / state.itemsPerPage),
        currentPage: 1,
      };
    case "GO_PAGE":
      return { ...state, currentPage: action.payload };
    case "NEXT":
      return {
        ...state,
        currentPage: Math.min(state.currentPage + 1, state.totalPages),
      };
    case "PREV":
      return {
        ...state,
        currentPage: Math.max(state.currentPage - 1, 1),
      };
    default:
      return state;
  }
}

export default function InnerCard({ festivals, currentSeason, selectedDistrict,isFavorite }) {
  const [state, dispatch] = useReducer(reducer, initialState);              // 페이지네이션 상태
  const [searchQuery, setSearchQuery] = useState("");                       // 검색어
  const [sortOption, setSortOption] = useState("rating-desc");              // 정렬 옵션
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);        // 찜 필터 여부

  // 🔁 지역 또는 계절 변경 시 검색어 초기화
  useEffect(() => {
    setSearchQuery("");
  }, [selectedDistrict, currentSeason]);

  // 🔁 검색어나 정렬 방식이 바뀔 때 페이지를 1페이지로 초기화
  useEffect(() => {
    dispatch({ type: "GO_PAGE", payload: 1 });
  }, [searchQuery, sortOption]);

  // 🔍 필터링 및 정렬된 축제 목록 계산
  const finalFestivals = useMemo(() => {
    // 🔍 1. 검색어 필터링
    let result = festivals.filter((festival) =>
      festival.TITLE.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ❤️ 2. 찜한 것만 보기 옵션이 켜져 있을 경우 추가 필터링
    if (showOnlyFavorites) {
      result = result.filter((festival) => isFavorite(festival.TITLE));
    }

    // 🔀 3. 정렬 방식 적용
    switch (sortOption) {
      case "title-asc":
        result.sort((a, b) => a.TITLE.localeCompare(b.TITLE));
        break;
      case "title-desc":
        result.sort((a, b) => b.TITLE.localeCompare(a.TITLE));
        break;
      case "rating-asc":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "rating-desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return [...result]; // ✅ 방어적 복사
  }, [festivals, searchQuery, sortOption, showOnlyFavorites, isFavorite]);
  // 📦 페이지 계산
  useEffect(() => {
    dispatch({ type: "SET_TOTAL", payload: finalFestivals.length });
  }, [finalFestivals]);

  const currentItems = finalFestivals.slice(
    (state.currentPage - 1) * state.itemsPerPage,
    state.currentPage * state.itemsPerPage
  );

  const pageNumbers = generatePageNumbers(state.currentPage, state.totalPages);

  return (
    <div
      className="w-100 text-start mb-3"
      style={{
        flexGrow: 1,
        overflowY: "auto",
        backgroundColor: "#FDFDFD",
        borderRadius: 20,
        padding: 20,
        boxSizing: "border-box",
      }}
    >
      {/* 🔍 검색창 */}
      <Form.Control
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          borderRadius: "10px",
          backgroundColor: "#EEEEEE",
          maxWidth: "400px",
          margin: "10px auto",
        }}
      />

      {/* 🔀 정렬 옵션 */}
      <div className="d-flex justify-content-center w-100 mb-2" style={{ fontSize: "14px" }}>
        <Form.Check
          inline
          label="제목순 ↓"
          name="sort"
          type="radio"
          id="sort-title-desc"
          value="title-desc"
          checked={sortOption === "title-desc"}
          onChange={(e) => setSortOption(e.target.value)}
        />
        <Form.Check
          inline
          label="제목순 ↑"
          name="sort"
          type="radio"
          id="sort-title-asc"
          value="title-asc"
          checked={sortOption === "title-asc"}
          onChange={(e) => setSortOption(e.target.value)}
        />
        <Form.Check
          inline
          label="평점순 ↓"
          name="sort"
          type="radio"
          id="sort-rating-desc"
          value="rating-desc"
          checked={sortOption === "rating-desc"}
          onChange={(e) => setSortOption(e.target.value)}
        />
        <Form.Check
          inline
          label="평점순 ↑"
          name="sort"
          type="radio"
          id="sort-rating-asc"
          value="rating-asc"
          checked={sortOption === "rating-asc"}
          onChange={(e) => setSortOption(e.target.value)}
        />
        <Form.Check
          inline
          label="찜"
          type="checkbox"
          id="show-only-favorites"
          checked={showOnlyFavorites}
          onChange={(e) => setShowOnlyFavorites(e.target.checked)}
        />
      </div>

      {/* 📋 축제 리스트 */}
      {currentItems.length === 0 ? (
        <p>축제가 없습니다.</p>
      ) : (
        currentItems.map((festival, idx) => (
          <InnerList
            key={`${festival.TITLE}-${idx}`}
            idx={idx}
            festival={festival}
            currentSeason={currentSeason}
          />
        ))
      )}

      {/* 📄 페이지네이션 */}
      {state.totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => dispatch({ type: "PREV" })}
            disabled={state.currentPage === 1}
          >
            〈
          </Button>

          {pageNumbers.map((num) => (
            <span
              key={num}
              style={{
                fontSize: "14px",
                fontWeight: state.currentPage === num ? "bold" : "normal",
                cursor: "pointer",
              }}
              onClick={() => dispatch({ type: "GO_PAGE", payload: num })}
            >
              {num}
            </span>
          ))}

          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => dispatch({ type: "NEXT" })}
            disabled={state.currentPage === state.totalPages}
          >
            〉
          </Button>
        </div>
      )}
    </div>
  );
}
