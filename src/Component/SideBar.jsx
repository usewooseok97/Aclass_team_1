import { Card, Form } from "react-bootstrap";
import InnerCard from "./InnerCard";
import { useFestivalUI } from "../Hooks/FestivalHooks";
import Button from "./MyButton";


// ✅ 사이드바 컴포넌트: 특정 구 선택 시 우측에 축제 목록 패널 표시

export default function Sidebar() {
  const {
    sidebarVisible: visible,
    selectedDistrict,
    filteredFestivals: festivals,
    currentSeason,
    handleCloseSidebar: onClose,
    isFavorite, 
  } = useFestivalUI();

  if (!visible) return null;

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "600px",
        flex: "1 1 400px", // ✅ 반응형 flex
        borderRadius: "10px",
        backgroundColor: "white",
        boxShadow: "0 0 10px rgba(0,0,0,0.15)",
        padding: "20px",
      }}
    >
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type={"behind"} clickEvent={onClose} currentSeason={currentSeason}/>
      </div>

      <h4 className="mt-2 mb-3">{selectedDistrict} 축제</h4>

      <InnerCard
        festivals={festivals}
        currentSeason={currentSeason}
        selectedDistrict={selectedDistrict}
        isFavorite={isFavorite}
      />
    </Card>
  );
}