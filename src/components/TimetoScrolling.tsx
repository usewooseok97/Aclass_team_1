import { useTimePhase } from '../hooks/useTimePhase';
import WeatherIconMap from '../constants/WeatherIcons';

const TimetoScrolling = () => {
  const { phase, iconPosition } = useTimePhase();

  // 배경 색상 클래스 반환
  const getBackgroundClass = (phase: string): string => {
    switch (phase) {
      case 'day':
        return 'bg-gradient-to-r from-sky-300 to-sky-400';
      case 'sunset':
        return 'bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400';
      case 'night':
        return 'bg-gradient-to-r from-indigo-900 to-purple-900';
      default:
        return 'bg-sky-300';
    }
  };

  // 현재 phase에 맞는 아이콘 컴포넌트 가져오기
  const IconComponent = WeatherIconMap[phase as keyof typeof WeatherIconMap];

  return (
    <article
      className={`relative rounded-full overflow-hidden transition-colors duration-1000 ${getBackgroundClass(phase)}`}
      style={{ width: '180px', height: '50px' }}
    >
      {/* 구름 (낮) */}
      {phase === 'day' && (
        <>
          <div className="absolute top-2 left-8 w-8 h-4 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-3 left-10 w-6 h-3 bg-white rounded-full opacity-70"></div>
        </>
      )}

      {/* 별 (밤) */}
      {phase === 'night' && (
        <>
          <div className="absolute top-2 right-8 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-4 right-12 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-3 right-6 w-0.5 h-0.5 bg-white rounded-full"></div>
          <div className="absolute top-1 right-10 w-0.5 h-0.5 bg-white rounded-full"></div>
        </>
      )}

      {/* 태양/달/석양 아이콘 */}
      <div
        className="absolute top-1/2"
        style={{
          left: `${iconPosition}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.1s linear'
        }}
      >
        {IconComponent && (
          <IconComponent
            size={32}
            className={
              phase === 'day' ? 'text-yellow-400' :
              phase === 'sunset' ? 'text-orange-300' :
              'text-blue-100'
            }
          />
        )}
      </div>
    </article>
  );
};

export { TimetoScrolling };
