import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
  onLoad?: () => void;
}

export const ImageWithFallback = ({
  src,
  alt,
  fallback,
  className,
  onLoad,
}: ImageWithFallbackProps) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <>
        {fallback || (
          <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--card-bg)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>이미지 로드 실패</span>
          </div>
        )}
      </>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      onLoad={onLoad}
    />
  );
};
