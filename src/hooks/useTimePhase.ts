import { useState, useEffect } from 'react';

type TimePhase = 'morning' | 'day' | 'sunset' | 'night';

interface ArcPosition {
  x: number;
  y: number;
}

export const useTimePhase = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [iconPosition, setIconPosition] = useState(0);
  const [arcPosition, setArcPosition] = useState<ArcPosition>({ x: 50, y: 50 });

  /**
   * 반원 궤도 좌표 계산
   * 해/달이 화면 1/3 지점에서 시작하여 2/3 지점에서 끝나는 반원 경로를 따라 이동
   *
   * @param progress - 0(시작) ~ 1(끝) 사이의 진행률
   * @returns {x, y} - 화면 내 위치 (% 단위)
   */
  const calculateArcPosition = (progress: number): ArcPosition => {
    // X축 이동 범위: 화면의 1/3(33.33%) ~ 2/3(66.66%) 구간
    const startX = 33.33;  // X 시작 위치 (화면 왼쪽 1/3 지점)
    const endX = 66.66;    // X 끝 위치 (화면 오른쪽 2/3 지점)

    // Y축 궤도 설정
    const baseY = 55;      // 시작/끝점의 Y 위치 (지평선, 55% = 중앙보다 5% 아래)
    const arcHeight = 30;  // 궤도의 최대 높이 (정점에서 baseY로부터 얼마나 올라가는지)

    // X 좌표: progress에 따라 선형 이동 (startX → endX)
    const x = startX + (endX - startX) * progress;

    // Y 좌표: sin 함수로 반원 궤도 생성
    // progress=0: y=55 (시작점)
    // progress=0.5: y=55-30=25 (정점, 가장 높음)
    // progress=1: y=55 (끝점)
    const y = baseY - arcHeight * Math.sin(progress * Math.PI);

    return { x, y };
  };

  // 시간대별 진행률 계산 (해: 6-18시, 달: 18-6시)
  const calculateProgress = (hour: number, minute: number): number => {
    const timeInHours = hour + minute / 60;

    if (hour >= 6 && hour < 18) {
      // 낮 (6시~18시): 12시간 동안 0~1
      return (timeInHours - 6) / 12;
    } else {
      // 밤 (18시~6시): 12시간 동안 0~1
      if (hour >= 18) {
        return (timeInHours - 18) / 12;
      } else {
        return (timeInHours + 6) / 12;
      }
    }
  };

  // 기존 아이콘 위치 계산 함수 (호환성 유지)
  const calculateIconPosition = (timeInHours: number): number => {
    const hour = Math.floor(timeInHours);
    const minute = (timeInHours - hour) * 60;

    if (hour >= 6) {
      return ((hour - 6) + minute / 60) / 24 * 100;
    } else {
      return ((hour + 18) + minute / 60) / 24 * 100;
    }
  };

  // phase 계산 함수 (4단계)
  const getTimePhase = (date: Date): TimePhase => {
    const hour = date.getHours();
    if (hour >= 6 && hour < 9) return 'morning';
    if (hour >= 9 && hour < 16) return 'day';
    if (hour >= 16 && hour < 18) return 'sunset';
    return 'night';
  };

  // 실시간 시간 데이터 업데이트 (requestAnimationFrame)
  useEffect(() => {
    let animationFrameId: number;
    let lastPosition = -1;
    let lastArcX = -1;
    let lastPhase: TimePhase | null = null;

    const updateTimeData = () => {
      const now = new Date(1995, 11, 17, 6, 24, 0); // 테스트용
      // const now = new Date();
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

      // Arc position 업데이트 (반원 궤도)
      const progress = calculateProgress(hour, minute);
      const newArcPosition = calculateArcPosition(progress);
      const roundedArcX = Math.round(newArcPosition.x * 100) / 100;
      if (roundedArcX !== lastArcX) {
        setArcPosition(newArcPosition);
        lastArcX = roundedArcX;
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
  const isDaytime = hour >= 6 && hour < 18;

  return { phase, hour, minute, timeInHours, iconPosition, currentTime, arcPosition, isDaytime };
};
