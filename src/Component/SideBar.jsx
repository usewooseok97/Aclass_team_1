import { Card, Form, Button } from "react-bootstrap";
import InnerCard from "./InnerCard";


// ✅ 사이드바 컴포넌트: 특정 구 선택 시 우측에 축제 목록 패널 표시
// props:
// - visible: 표시 여부 (false면 null 반환)
// - district: 선택된 구 이름 (제목 표시용)
// - festivals: 필터링된 축제 리스트
// - onClose: 닫기 버튼 클릭 시 실행될 함수

export default function Sidebar({ visible, district, festivals = [], onClose ,currentSeason={currentSeason} }) {
  if (!visible) return null; // 🔹 visible이 false면 컴포넌트 자체를 렌더링하지 않음

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: '600px',               // 최대 너비
        borderTopLeftRadius: '10px',     // 왼쪽 위 모서리 둥글게
        borderBottomLeftRadius: '10px',  // 왼쪽 아래 모서리 둥글게
        borderLeft: 'none',              // 왼쪽 테두리 제거
        backgroundColor: 'transparent',  // 배경 투명
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 0 10px rgba(0,0,0,0.15)', // 그림자 효과
        marginLeft: "10%"
      }}
    >
      {/* 🔹 상단 ← 버튼 (뒤로가기 / 닫기 기능) */}
      <div style={{ alignSelf: 'flex-start' }}>
        <Button variant="light" size="sm" onClick={onClose}>
          ←
        </Button>
      </div>

      {/* 🔹 구 이름 제목 */}
      <h4 className="mt-2 mb-3">{district} 축제</h4>

      {/* 🔹 축제 리스트 출력 (페이지네이션 포함) */}
      <InnerCard festivals={festivals} currentSeason={currentSeason} />
    </Card>
  );
}