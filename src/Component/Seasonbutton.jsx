// ✅ 하나의 계절 버튼 컴포넌트
// props:
// - season: 버튼에 표시될 계절 이름 (봄/여름/가을/겨울 중 하나)
// - currentSeason: 현재 선택된 계절 (선택 여부 확인용)
// - setCurrentSeason: 계절 변경 함수

export default function SeasonButton({ season, currentSeason, setCurrentSeason }) {
  return (
    <button
      key={season} // 🔹 배열 내 사용 시 유일 키
      className={`btn btn-${season === currentSeason ? 'primary' : 'outline-primary'} me-2 my-1`}
      // 🔹 현재 계절이면 primary 색상, 아니면 outline 스타일
      onClick={() => setCurrentSeason(season)} // 🔹 클릭 시 계절 변경
    >
      {season}
    </button>
  );
}