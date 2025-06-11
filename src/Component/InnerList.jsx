import springIcon from '../assets/spring.png';
import summerIcon from '../assets/summer.png';
import fallIcon from '../assets/fall.png';
import winterIcon from '../assets/winter.png';
import { RatingStars } from './RatingStars';
import { useFestivalUI } from '../Hooks/FestivalHooks';

export function InnerList({  festival, currentSeason }) {
  const { setSelectedFestival, toggleFavorite,isFavorite } = useFestivalUI();

  const favorite = isFavorite(festival.TITLE);

  const seasonIcons = {
    봄: springIcon,
    여름: summerIcon,
    가을: fallIcon,
    겨울: winterIcon,
  };
  const icon = seasonIcons[currentSeason] || '';

  return (
      <div className="mb-3">
        {/* 상단: 제목 + 계절 아이콘 */}
        <div
          onClick={() => setSelectedFestival(festival)}
          style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
        >
          <span style={{ color: 'black' }}>■</span>
          <span>{festival.TITLE}</span>
          <img
            src={icon}
            alt={`${currentSeason} 아이콘`}
            style={{ width: '20px', height: '20px', verticalAlign: 'middle' }}
          />
        </div>

        {/* 하단: 평점 + 별점 + 찜 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between", // 왼쪽: 평점/별점, 오른쪽: 찜
            marginTop: "4px",
          }}
        >
          {/* 왼쪽: 평점 + 별점 */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#666" }}>
              ({festival.rating || '평점없음'})
            </span>
            <RatingStars rating={festival.rating} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(festival.TITLE);
              }}
            >
              {favorite ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>
  );
}
