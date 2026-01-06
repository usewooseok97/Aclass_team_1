import springIcon from '../assets/spring.png';
import summerIcon from '../assets/summer.png';
import fallIcon from '../assets/fall.png';
import winterIcon from '../assets/winter.png';

const SeasonButton = () => {
  const seasonIcons = {
    봄: springIcon,
    여름: summerIcon,
    가을: fallIcon,
    겨울: winterIcon,
  };


  return (
    <button
      className={`btn btn-primary' me-2 my-1 `}
     
    >
      {/* ✅ 선택된 계절일 때만 아이콘 표시 */}
       
        <img
          src={springIcon}
          alt={`  아이콘`}
          style={{ width: '20px', height: '20px', marginRight: '6px' }}
        />
    </button>
  );
}
export default SeasonButton