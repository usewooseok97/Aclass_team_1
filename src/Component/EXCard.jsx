import { Button } from "react-bootstrap";
import { InnerList } from "./InnerList";

export function Extercard({ festival, currentSeason, onClose }) {
  if (!festival) return null;

  return (
    <div
      style={{
        width: "900px", // SeoulMap과 동일 너비
        backgroundColor: "#fff",
        borderRadius: "20px",
        boxShadow: "0 0 15px rgba(0,0,0,0.25)",
        overflow: "hidden",
        paddingBottom: "20px",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <Button variant="light" size="sm" onClick={onClose}>
          ←
        </Button>
      </div>
      {/* 상단 이미지 */}
      <img
        src={festival.MAIN_IMG}
        alt={festival.TITLE}
        style={{ width: "50%", height: "auto", objectFit: "cover" }}
      />

      <div style={{ padding: "20px" }}>
        {/* 뒤로가기 버튼 (Sidebar와 동일 스타일) */}

        {/* 제목 영역: InnerList 재사용 */}
        <InnerList
          idx={0}
          festival={festival}
          currentSeason={currentSeason}
        />

        {/* 상세 설명 예시 */}
        <ul style={{ paddingLeft: "0", listStyle: "none", marginTop: "20px", fontSize: "14px", lineHeight: "1.6" }}>
          <li>📍 <strong>위치:</strong> 서울시 {festival.GUNAME} 방이 21</li>
          <li>📅 <strong>기간:</strong> {festival.DATE || '3월 ~ 4월'}</li>
          <li>🍜 <strong>대표 먹거리:</strong> 명가들깨칼국수 본점</li>
          <li>
            🎵 동작구는 다음 달 초 전문 심사위원들의 영상 심사를 거쳐 분야당 10팀 내외로 출전팀을 선정할 계획이다. 
            최종 선정된 팀은 페스티벌 당일에 5분 내외의 공연을 펼치게 되며, 소정의 활동비도 지원받을 수 있다.
          </li>
        </ul>

        <div className="text-end mt-2" style={{ fontSize: '12px', color: '#999' }}>
          상세 페이지 →
        </div>
      </div>
    </div>
  );
}
