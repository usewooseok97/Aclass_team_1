import React, { useEffect, useRef, useState } from 'react';

export default function ImageMapper({
  src,
  map,
  width,
  imgWidth,
  onClick,
  onMouseEnter,
  onMouseLeave,
  responsive = false,
}) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(width || 0);
  const [hovered, setHovered] = useState(false);
  const rainbowOffsetRef = useRef(0); // 🌈 애니메이션 offset 저장
  const animationRef = useRef(null);  // requestAnimationFrame id 저장

  useEffect(() => {
    const img = new Image();
    img.onload = () => setNaturalWidth(img.width);
    img.src = src;
  }, [src]);

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

  const scaleCoords = coords => {
    const scale = (containerWidth || width) / (imgWidth || naturalWidth);
    return coords.map(coord => coord * scale);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !map || !map.areas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    map.areas.forEach(area => {
      const coords = scaleCoords(area.coords);
      const shape = area.shape.toLowerCase();
      ctx.beginPath();

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

      // 🎨 기본 색상
      let strokeColor = area.active ? area.fillColor : area.preFillColor;

      // 🌈 topDistricts일 경우 무지개 stroke 적용
      if (area.isTop) {
        const offset = rainbowOffsetRef.current;
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop((0 + offset) % 1, "red");
        gradient.addColorStop((0.25 + offset) % 1, "orange");
        gradient.addColorStop((0.5 + offset) % 1, "yellow");
        gradient.addColorStop((0.75 + offset) % 1, "green");
        strokeColor = gradient;
      }

      ctx.strokeStyle = strokeColor || 'rgba(0, 0, 255, 0.8)';
      ctx.lineWidth = area.active || area.isTop ? 8 : 1;
      ctx.setLineDash(area.active ? [10, 0] : []);
      ctx.shadowColor = area.active ? 'rgba(255, 0, 0, 0.4)' : 'transparent';
      ctx.shadowBlur = area.active ? 8 : 0;
      ctx.stroke();
    });
  };

  const animate = () => {
    rainbowOffsetRef.current += 0.005; // ← 🌈 여기서 속도 조절 (작을수록 느림)
    if (rainbowOffsetRef.current > 1) rainbowOffsetRef.current = 0;
    drawCanvas();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [map, containerWidth]);

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
          onClick={e => onClick && onClick(area, e)}
          onMouseEnter={e => {
            setHovered(true);
            onMouseEnter && onMouseEnter(area, e);
          }}
          onMouseLeave={e => {
            setHovered(false);
            onMouseLeave && onMouseLeave(area, e);
          }}
        />
      );
    });
  };

  return (
    <div style={{ position: 'relative', width: width || '100%' }}>
      <canvas
        ref={canvasRef}
        width={containerWidth || width || 900}
        height={imgRef.current?.offsetHeight || 600}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />
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
      <map name={map.name}>
        {renderAreas()}
      </map>
    </div>
  );
}
