import { useEffect, useState } from "react";
import { Button ,Form } from "react-bootstrap";
import { InnerList } from "./InnerList";


// ✅ 축제 리스트 + 페이지네이션 렌더링 컴포넌트
// props:
// - festivals: 축제 데이터 배열 (필터링된 결과)

export default function InnerCard({ festivals , currentSeason }) {

  const itemsPerPage = 8; // ✅ 페이지당 항목 수
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지 번호 상태

    useEffect(() => {
    setCurrentPage(1);
  }, [festivals , currentSeason]);

  // ✅ 전체 페이지 수 계산
  const totalPages = Math.ceil(festivals.length / itemsPerPage);

  // ✅ 현재 페이지에서 보여줄 항목 인덱스 계산
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = festivals.slice(startIndex, startIndex + itemsPerPage);

  // ✅ 특정 페이지 번호 클릭 시 처리
  const handlePageClick = (page) => setCurrentPage(page);

  // ✅ 이전 페이지로 이동
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // ✅ 다음 페이지로 이동
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // ✅ 페이지 번호 배열 생성 (최대 5개만 표시)
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // 페이지 개수가 부족한 경우 앞쪽 채우기
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // start ~ end까지 페이지 번호 생성
    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="w-100 text-start mb-3" style={{ flexGrow: 1, overflowY: 'auto', backgroundColor:"#FDFDFD" , borderRadius:20 ,padding:20, boxSizing:"border-box" }}>
            {/* 🔹 검색 입력창 */}
      <Form.Control
        type="text"
        placeholder="Search"
        style={{ borderRadius: '10px' , backgroundColor : "#EEEEEE", maxWidth: "400px",margin:"auto",marginTop:10,marginBottom:10  }}
      />

      {/* 🔹 정렬 라디오 버튼 (제목순 / 평점순) */}
      <div className="d-flex justify-content-end w-100 mb-2" style={{ fontSize: '14px' }}>
        <Form.Check
          inline
          label="제목순"
          name="sort"
          type="radio"
          id="sort-title"
          defaultChecked
        />
        <Form.Check
          inline
          label="평점순 ↑"
          name="sort"
          type="radio"
          id="sort-rating"
        />
      </div>
      {/* ✅ 축제 항목이 없을 경우 */}
      {currentItems.length === 0 ? (
        <p>축제가 없습니다.</p>
      ) : (
        <>
          {currentItems.map((festival, idx) => (
            <InnerList
              key={idx}
              idx={idx}
              festival={festival}
              currentSeason={currentSeason}
            />
          ))}
        </>
      )}

      {/* ✅ 페이지네이션 영역 */}
      {totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-center gap-2 mt-3">
          {/* 이전 페이지 버튼 */}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            〈
          </Button>

          {/* 페이지 번호 버튼 */}
          {generatePageNumbers().map((num) => (
            <span
              key={num}
              style={{
                fontSize: '14px',
                fontWeight: currentPage === num ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
              onClick={() => handlePageClick(num)}
            >
              {num}
            </span>
          ))}

          {/* 다음 페이지 버튼 */}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            〉
          </Button>
        </div>
      )}
    </div>
  );
}