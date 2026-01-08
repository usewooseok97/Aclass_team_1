import { useState, useEffect } from 'react';

type TimePhase = 'day' | 'sunset' | 'night';

export const useTimePhase = () => {
  // 초기 시간 설정은 useState에서 직접
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [iconPosition, setIconPosition] = useState(0);

  // 아이콘 위치 계산 함수
  const calculateIconPosition = (timeInHours: number): number => {
    const hour = Math.floor(timeInHours);
    const minute = (timeInHours - hour) * 60;

    if (hour >= 6) {
      return ((hour - 6) + minute / 60) / 24 * 100;
    } else {
      return ((hour + 18) + minute / 60) / 24 * 100;
    }
  };

  // phase 계산 함수
  const getTimePhase = (date: Date): TimePhase => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 16) return 'day';
    if (hour >= 16 && hour < 19) return 'sunset';
    return 'night';
  };

  // 실시간 시간 데이터 업데이트 (requestAnimationFrame)
  useEffect(() => {
    let animationFrameId: number;
    let lastPosition = -1;
    let lastPhase: TimePhase | null = null;

    const updateTimeData = () => {
      // const now = new Date( 1995, 11, 17, 7, 24, 0);
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeInHours = hour + minute / 60;

      // Phase 체크 및 업데이트 (phase가 변경될 때만)
      const currentPhase = getTimePhase(now);
      if (currentPhase !== lastPhase) {
        setCurrentTime(now);
        lastPhase = currentPhase;
      }

      // Icon position 업데이트 (위치가 실제로 변경될 때만)
      const position = calculateIconPosition(timeInHours);
      const roundedPosition = Math.round(position * 100) / 100;
      if (roundedPosition !== lastPosition) {
        setIconPosition(position);
        lastPosition = roundedPosition;
      }

      // 다음 프레임에서 다시 계산
      animationFrameId = requestAnimationFrame(updateTimeData);
    };

    updateTimeData();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const phase = getTimePhase(currentTime);
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const timeInHours = hour + minute / 60;

  return { phase, hour, minute, timeInHours, iconPosition, currentTime };
};
