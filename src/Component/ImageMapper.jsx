import React, { useEffect, useRef, useState } from 'react';

export default function ImageMapper({
  src,              // 이미지 경로
  map,              // 지도 좌표 데이터 (areas 포함)
  width,            // 이미지 너비
  imgWidth,         // 원본 이미지 너비
  onClick,          // 클릭 이벤트 콜백
  onMouseEnter,     // 마우스 진입 이벤트 콜백
  onMouseLeave,     // 마우스 이탈 이벤트 콜백
  responsive = false, // 반응형 설정 여부
}) {
  const imgRef = useRef(null);        // 이미지 요소 참조
  const canvasRef = useRef(null);     // 캔버스 요소 참조
  const [naturalWidth, setNaturalWidth] = useState(0);        // 이미지 원본 너비 저장
  const [containerWidth, setContainerWidth] = useState(width || 0); // 컨테이너 너비
  const [hovered, setHovered] = useState(false);              // hover 여부 상태

  // 이미지 로딩 후 원본 너비 가져오기
  useEffect(() => {
    const img = new Image();
    img.onload = () => setNaturalWidth(img.width);
    img.src = src;
  }, [src]);

  // 반응형일 경우 창 크기 변화 감지하여 containerWidth 갱신
  useEffect(() => {
    if (responsive && imgRef.current) {
      const handleResize = () => {
        if (imgRef.current) {
          setContainerWidth(imgRef.current.offsetWidth);
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [responsive]);

  // 좌표 비율을 현재 이미지 크기에 맞게 스케일링
  const scaleCoords = coords => {
    const scale = (containerWidth || width) / (imgWidth || naturalWidth);
    return coords.map(coord => coord * scale);
  };

  // canvas에 외곽선을 그림
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !map || !map.areas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 초기화

    map.areas.forEach(area => {
      const coords = scaleCoords(area.coords);
      const strokeColor = area.active ? area.fillColor : area.preFillColor;
      const shape = area.shape.toLowerCase();

      ctx.beginPath();

      // 도형 그리기
      if (shape === 'circle') {
        ctx.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
      } else if (shape === 'rect') {
        ctx.rect(coords[0], coords[1], coords[2] - coords[0], coords[3] - coords[1]);
      } else if (shape === 'poly') {
        coords.forEach((coord, index) => {
          if (index % 2 === 0) {
            const x = coords[index];
            const y = coords[index + 1];
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
      }

      // 외곽선 스타일 적용
      ctx.strokeStyle = strokeColor || 'rgba(0, 0, 255, 0.8)';
      ctx.lineWidth = area.active ? 8 : 1;
      ctx.setLineDash(area.active ? [10, 0] : []); // hover 시 점선
      ctx.shadowColor = area.active ? 'rgba(255, 0, 0, 0.4)' : 'transparent'; // hover 시 그림자
      ctx.shadowBlur = area.active ? 8 : 0;
      ctx.stroke(); // 선만 그림
    });
  };

  // map, width가 바뀔 때마다 캔버스 다시 그림
  useEffect(() => {
    drawCanvas();
  }, [map, containerWidth]);

  // <map> 태그 내의 <area> 요소 렌더링
  const renderAreas = () => {
    if (!map || !map.areas || !Array.isArray(map.areas)) return null;

    return map.areas.map(area => {
      const coords = scaleCoords(area.coords);
      const shape = area.shape.toLowerCase();

      return (
        <area
          key={area.id || area.name}
          shape={shape}
          coords={coords.join(',')}
          href={area.href}
          alt={area.name}
          onClick={e => onClick && onClick(area, e)} // 클릭 시 콜백 호출
          onMouseEnter={e => {
            setHovered(true);                     // hover 상태 true
            onMouseEnter && onMouseEnter(area, e);
          }}
          onMouseLeave={e => {
            setHovered(false);                    // hover 상태 false
            onMouseLeave && onMouseLeave(area, e);
          }}
        />
      );
    });
  };

  // 전체 이미지맵 구조 렌더링
  return (
    <div style={{ position: 'relative', width: width || '100%' }}>
      {/* canvas는 hover 시 zIndex: 3으로 위에 올라오고, 외곽선만 그림 */}
      <canvas
        ref={canvasRef}
        width={containerWidth || width || 900}
        height={imgRef.current?.offsetHeight || 600}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: hovered ? 3 : 0,
          transition: 'all 0.3s ease-in-out',
          opacity: hovered ? 1 : 0.5,
          pointerEvents: 'none'
        }}
      />
      {/* 실제 지도 이미지 */}
      <img
        ref={imgRef}
        src={src}
        useMap={`#${map.name}`}
        alt=""
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
      {/* 이미지맵 정의 */}
      <map name={map.name}>
        {renderAreas()}
      </map>
    </div>
  );
}
