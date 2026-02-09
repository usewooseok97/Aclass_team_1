import { useTimePhase } from '../hooks/useTimePhase';
import { Sun, Moon } from 'lucide-react';

const TimetoScrolling = () => {
  const {
    phase,
    sunPosition,
    moonPosition,
    isSunVisible,
    isMoonVisible
  } = useTimePhase();


  return (
    <div
      className="absolute inset-0 overflow-hidden transition-all duration-1000">
      {/* 구름 (아침/낮) */}
      {(phase === 'morning' || phase === 'day') && (
        <>
          <div className="absolute top-4 left-[15%] w-16 h-8 bg-white/60 rounded-full blur-sm" />
          <div className="absolute top-6 left-[18%] w-12 h-6 bg-white/50 rounded-full blur-sm" />
          <div className="absolute top-8 right-[20%] w-20 h-10 bg-white/50 rounded-full blur-sm" />
          <div className="absolute top-10 right-[25%] w-14 h-7 bg-white/40 rounded-full blur-sm" />
        </>
      )}

      {/* 노을 구름 */}
      {phase === 'sunset' && (
        <>
          <div className="absolute top-4 left-[15%] w-16 h-8 bg-orange-200/40 rounded-full blur-sm" />
          <div className="absolute top-8 right-[20%] w-20 h-10 bg-pink-200/40 rounded-full blur-sm" />
        </>
      )}

      {/* 별 (밤) */}
      {phase === 'night' && (
        <>
          <div className="absolute top-3 left-[10%] w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-6 left-[25%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <div className="absolute top-4 left-[40%] w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-8 right-[35%] w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-5 right-[15%] w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <div className="absolute top-10 right-[25%] w-1 h-1 bg-white rounded-full animate-pulse" />
          <div className="absolute top-2 right-[10%] w-0.5 h-0.5 bg-white rounded-full" />
          <div className="absolute top-12 left-[30%] w-0.5 h-0.5 bg-white rounded-full" />
        </>
      )}

      {/* 해 - 지평선 위에 있을 때만 표시 */}
      {isSunVisible && (
        <div
          className="absolute transition-all duration-100 ease-linear"
          style={{
            left: `${sunPosition.x}%`,
            top: `${sunPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Sun
            size={40}
            className={`drop-shadow-lg ${
              phase === 'morning'
                ? 'text-orange-400'
                : phase === 'sunset'
                ? 'text-orange-500'
                : 'text-yellow-400'
            }`}
            fill="currentColor"
          />
        </div>
      )}

      {/* 달 - 지평선 위에 있을 때만 표시 */}
      {isMoonVisible && (
        <div
          className="absolute transition-all duration-100 ease-linear"
          style={{
            left: `${moonPosition.x}%`,
            top: `${moonPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Moon
            size={36}
            className="text-yellow-100 drop-shadow-lg"
            fill="currentColor"
          />
        </div>
      )}
    </div>
  );
};

export { TimetoScrolling };
