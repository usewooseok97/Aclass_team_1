import springIcon from '../assets/spring.png';
import summerIcon from '../assets/summer.png';
import fallIcon from '../assets/fall.png';
import winterIcon from '../assets/winter.png';

export default function SeasonButton({ season, currentSeason, setCurrentSeason }) {
  const seasonIcons = {
    봄: springIcon,
    여름: summerIcon,
    가을: fallIcon,
    겨울: winterIcon,
  };

  const isActive = season === currentSeason;
  const icon = seasonIcons[season];

  return (
    <button
      className={`btn btn-${isActive ? 'primary' : 'outline-primary'} me-2 my-1 `}
      onClick={() => setCurrentSeason(season)}
    >
      {/* ✅ 선택된 계절일 때만 아이콘 표시 */}
      {isActive && icon && 
        <img
          src={icon}
          alt={`${season} 아이콘`}
          style={{ width: '20px', height: '20px', marginRight: '6px' }}
        />
      }
      {season}
    </button>
  );
}
