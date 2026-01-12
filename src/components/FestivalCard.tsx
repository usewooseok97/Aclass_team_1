import { useState } from 'react';
import { type Festival } from '../types/festival';

interface FestivalCardProps {
  festival: Festival;
  onClick: () => void;
}

const FestivalCard = ({ festival, onClick }: FestivalCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Fallback image URL
  const fallbackImage = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden hover:scale-102 border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={imageError ? fallbackImage : festival.MAIN_IMG}
          alt={festival.TITLE}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover"
        />
        {/* Season badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
          {festival.season}
        </div>
        {/* Free/Paid badge */}
        <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-sm font-medium ${
          festival.IS_FREE === '무료'
            ? 'bg-green-500 text-white'
            : 'bg-blue-500 text-white'
        }`}>
          {festival.IS_FREE}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
          {festival.TITLE}
        </h3>

        {/* Date */}
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="line-clamp-1">{festival.DATE}</span>
        </div>

        {/* Place */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="line-clamp-1">{festival.PLACE}</span>
        </div>

        {/* Buzz Score */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">관심도</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${festival.buzz_score}%` }}
              />
            </div>
            <span className="font-bold text-purple-600 text-sm">{festival.buzz_score}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FestivalCard };
