import { useTimePhase } from '../hooks/useTimePhase';
import { Sun, Moon } from 'lucide-react';

const TimetoScrolling = () => {
  const { phase, arcPosition, isDaytime } = useTimePhase();

  // 시간대별 그라데이션
  const getGradient = (phase: string): string => {
    switch (phase) {
      case 'morning':
        return 'linear-gradient(to right, #fda4af, #fdba74, #fef08a)';
      case 'day':
        return 'linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)';
      case 'sunset':
        return 'linear-gradient(to right, #f97316, #db2777, #7c3aed)';
      case 'night':
        return 'linear-gradient(to right, #1e1b4b, #312e81, #1e3a5f)';
      default:
        return 'linear-gradient(to right, #7dd3fc, #38bdf8, #0ea5e9)';
    }
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden transition-all duration-1000"
      style={{ background: getGradient(phase) }}
    >
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

      {/* 해/달 아이콘 - 반원 궤도 */}
      <div
        className="absolute transition-all duration-100 ease-linear"
        style={{
          left: `${arcPosition.x}%`,
          top: `${arcPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {isDaytime ? (
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
        ) : (
          <Moon
            size={36}
            className="text-yellow-100 drop-shadow-lg"
            fill="currentColor"
          />
        )}
      </div>
    </div>
  );
};

export { TimetoScrolling };
