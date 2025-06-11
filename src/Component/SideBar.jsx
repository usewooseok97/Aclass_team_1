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
  } = useFestivalUI();

  if (!visible) return null;

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: '600px',
        borderTopLeftRadius: '10px',
        borderBottomLeftRadius: '10px',
        borderLeft: 'none',
        backgroundColor: 'transparent',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 0 10px rgba(0,0,0,0.15)',
        marginLeft: "10%"
      }}
    >
      <div style={{ alignSelf: 'flex-start' }}>
        <Button type={"behind"} clickEvent={onClose} currentSeason="null"/>
      </div>

      <h4 className="mt-2 mb-3">{selectedDistrict} 축제</h4>

      <InnerCard
        festivals={festivals}
        currentSeason={currentSeason}
        selectedDistrict={selectedDistrict}
      />
    </Card>
  );
}