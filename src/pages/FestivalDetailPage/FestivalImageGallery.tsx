import { useState } from "react";

interface FestivalImageGalleryProps {
  mainImage: string;
  title: string;
}

export const FestivalImageGallery = ({
  mainImage,
  title,
}: FestivalImageGalleryProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full aspect-video rounded-lg ">
        {!imageError ? (
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "var(--card-border)" }}
          >
            <span style={{ color: "var(--text-secondary)" }}>
              이미지를 불러올 수 없습니다
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
