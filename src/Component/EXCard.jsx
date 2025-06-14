import Button from "./MyButton";
import { InnerList } from "./InnerList";
import { useNavigate } from "react-router";
import { useFestivalUI } from "../Hooks/FestivalHooks";
import FestivalInfo from "./FestivalInfo";



export function Extercard() {
  const navigate = useNavigate();
  const {
    selectedFestival: festival,
    currentSeason,
    setSelectedFestival
  } = useFestivalUI();

  if (!festival) return null;

  console.log(festival)
  return (
    <div
      className="card mx-auto mb-4"
      style={{
        width: "900px",
        backgroundColor: "#fff",
        borderRadius: "20px",
        boxShadow: "0 0 15px rgba(0,0,0,0.25)",
        overflow: "hidden",
        paddingBottom: "20px",
      }}
    >
      {/* 뒤로가기 버튼 */}
      <div style={{ margin: "20px" }}>
          <Button type={"behind"} clickEvent={() => setSelectedFestival(null)} currentSeason={currentSeason}/>
      </div>

      {/* 상단 이미지 */}
      <img
        src={festival.MAIN_IMG}
        alt={festival.TITLE}
        className="card-img-top"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />

      {/* 내부 콘텐츠 */}
      <div className="card-body" style={{ padding: "20px" }}>
        {/* 제목, 평점 등 */}
        <InnerList
          idx={festival.TITLE}
          festival={festival}
          currentSeason={currentSeason}
        />

        {/* 아이콘 정보 목록 */}
        <FestivalInfo
          infoItems={[
            { icon: "🚩", text: festival.PLACE, copy: festival.PLACE },
            { icon: "🕒", text: festival.DATE },
          ]}
        />

        {/* 프로그램 설명 */}
        <p
          className="card-text"
          style={{
            whiteSpace: "pre-line",
            fontSize: "14px",
            color: "#333",
            marginTop: "15px",
          }}
        >
          프로그램 설명 : {festival.PROGRAM == "" ? "설명생략" : festival.PROGRAM}
        </p>

        {/* 상세 페이지 링크 */}
        <div
          className="text-end"
          style={{ fontSize: "12px", color: "#999", marginTop: "10px", cursor: "pointer" }}
          onClick={() => navigate(`/detail/${encodeURIComponent(festival.TITLE)}`)}
        >
          상세 페이지 →
        </div>
      </div>
    </div>
  );
}
