import { useState, useEffect } from 'react';

type TimePhase = 'morning' | 'day' | 'sunset' | 'night';

interface Position {
  x: number;
  y: number;
}

interface CelestialPositions {
  sun: Position;
  moon: Position;
}

export const useTimePhase = () => {
  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [positions, setPositions] = useState<CelestialPositions>({
    sun: { x: 50, y: 25 },
    moon: { x: 50, y: 95 }
  });

  /**
   * 원형 궤도 좌표 계산
   * 해와 달이 180° 반대편에 위치하며 24시간 동안 한 바퀴 회전
   *
   * 시간별 위치:
   * - 00:00: 해=하단, 달=상단(정점)
   * - 06:00: 해=좌측(떠오름), 달=우측(지는 중)
   * - 12:00: 해=상단(정점), 달=하단
   * - 18:00: 해=우측(지는 중), 달=좌측(떠오름)
   *
   * @param hour - 현재 시간 (0-23)
   * @param minute - 현재 분 (0-59)
   * @returns { sun, moon } - 각각 {x, y} 좌표 (% 단위)
   */
  const calculateCircularPosition = (hour: number, minute: number): CelestialPositions => {
    const timeInHours = hour + minute / 60;

    // 시간을 각도로 변환
    // 12시(정오)에 해가 정점(상단, -90°)에 오도록 오프셋 적용
    // 24시간 = 360° → 1시간 = 15°
    const sunAngleDeg = (timeInHours / 24) * 360 - 90;  // 12시에 -90° (상단)
    const sunAngle = sunAngleDeg * (Math.PI / 180);     // 라디안 변환
    const moonAngle = sunAngle + Math.PI;               // 해와 180° 반대

    // 궤도 설정
    const centerX = 50;   // 원의 중심 X (화면 중앙)
    const centerY = 60;   // 원의 중심 Y (지평선 위치, 60% = 약간 아래)
    const radius = 35;    // 궤도 반지름 (%)

    // 해 위치 계산
    // cos: X축 이동, sin: Y축 이동 (Y는 위가 작은 값이므로 - 적용)
    const sunX = centerX + radius * Math.cos(sunAngle);
    const sunY = centerY - radius * Math.sin(sunAngle);

    // 달 위치 계산 (해와 정반대)
    const moonX = centerX + radius * Math.cos(moonAngle);
    const moonY = centerY - radius * Math.sin(moonAngle);

    return {
      sun: { x: sunX, y: sunY },
      moon: { x: moonX, y: moonY }
    };
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
    let lastSunX = -1;
    let lastPhase: TimePhase | null = null;

    const updateTimeData = () => {
      // const now = new Date(1995, 11, 17, 6, 0, 0); // 테스트용: 시간 변경
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Phase 체크 및 업데이트 (phase가 변경될 때만)
      const currentPhase = getTimePhase(now);
      if (currentPhase !== lastPhase) {
        setCurrentTime(now);
        lastPhase = currentPhase;
      }

      // 원형 궤도 위치 업데이트
      const newPositions = calculateCircularPosition(hour, minute);
      const roundedSunX = Math.round(newPositions.sun.x * 100) / 100;
      if (roundedSunX !== lastSunX) {
        setPositions(newPositions);
        lastSunX = roundedSunX;
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

  // 지평선(centerY=60%) 기준 visibility 계산
  const horizonY = 60;
  const isSunVisible = positions.sun.y < horizonY;
  const isMoonVisible = positions.moon.y < horizonY;

  return {
    phase,
    hour,
    minute,
    currentTime,
    sunPosition: positions.sun,
    moonPosition: positions.moon,
    isSunVisible,
    isMoonVisible
  };
};
