import { type Place } from '../types/festival';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {/* Name and Category */}
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-800">{place.name}</h4>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {place.category}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 mb-2">
            <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-600 line-clamp-2">{place.address}</p>
          </div>

          {/* Phone */}
          {place.telephone && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${place.telephone}`} className="text-sm text-blue-600 hover:underline">
                {place.telephone}
              </a>
            </div>
          )}
        </div>

        {/* External Link (if available) */}
        {place.link && (
          <a
            href={place.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
            title="네이버에서 보기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
