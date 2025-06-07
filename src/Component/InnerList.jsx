import springIcon from '../assets/spring.png';
import summerIcon from '../assets/summer.png';
import fallIcon from '../assets/fall.png';
import winterIcon from '../assets/winter.png';
import { useContext } from 'react';
import { FestivalContext } from '../App';

export function InnerList({ idx, festival, currentSeason }) {

  const { setSelectedFestival } = useContext(FestivalContext);
  const seasonIcons = {
    봄: springIcon,
    여름: summerIcon,
    가을: fallIcon,
    겨울: winterIcon,
  };

  const icon = seasonIcons[currentSeason] || '';

  return (
    <div key={idx} className="mb-3" onClick={() => setSelectedFestival(festival)}>
      <span style={{ marginRight: '6px', color: 'black' }}>■</span>
      {festival.TITLE}
      <img
        src={icon}
        alt={`${currentSeason} 아이콘`}
        style={{ width: '20px', height: '20px', marginLeft: '6px', verticalAlign: 'middle' }}
      />
      <div>
        <span style={{ marginLeft: '8px', color: '#666' }}>
            ({festival.rating || '평점없음'})
        </span>
        <span style={{ marginLeft: '4px', color: '#ffa500' }}>★★★★☆</span>
      </div>
    </div>
  );
}