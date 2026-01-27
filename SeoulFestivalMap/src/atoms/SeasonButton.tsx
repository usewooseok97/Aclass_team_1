import springIcon from '../assets/spring.png';
import summerIcon from '../assets/summer.png';
import fallIcon from '../assets/fall.png';
import winterIcon from '../assets/winter.png';
import { useFestivalContext } from '../hooks/useFestivalContext';
import type { Season } from '../types/festival';

interface SeasonItem {
  id: Season;
  label: string;
  icon: string | null;
}

const seasons: SeasonItem[] = [
  { id: "전체", label: "전체", icon: null },
  { id: "봄", label: "봄", icon: springIcon },
  { id: "여름", label: "여름", icon: summerIcon },
  { id: "가을", label: "가을", icon: fallIcon },
  { id: "겨울", label: "겨울", icon: winterIcon },
];

const SeasonButton = () => {
  const { selectedSeason, setSelectedSeason } = useFestivalContext();

  return (
    <div className="flex justify-center items-center gap-2 py-2">
      {seasons.map((season) => {
        const isSelected = selectedSeason === season.id;

        return (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full
              text-sm font-medium transition-all duration-200
              ${isSelected
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {season.icon && (
              <img
                src={season.icon}
                alt={`${season.label} 아이콘`}
                className="w-5 h-5"
              />
            )}
            <span>{season.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export { SeasonButton };
