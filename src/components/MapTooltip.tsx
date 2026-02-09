import type { Festival } from '../types/festival';

interface TooltipState {
  festival: Festival;
  x: number;
  y: number;
}

interface MapTooltipProps {
  tooltip: TooltipState;
}

export const MapTooltip = ({ tooltip }: MapTooltipProps) => {
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-w-[260px]">

        {/* 축제 정보 */}
        <div className="p-3">
          <h4 className="font-semibold text-sm text-gray-800 leading-tight mb-1 line-clamp-2">
            {tooltip.festival.TITLE}
          </h4>
          <p className="text-xs text-gray-500 mb-1 line-clamp-1">
            {tooltip.festival.PLACE}
          </p>
          <p className="text-xs text-gray-400 mb-2">{tooltip.festival.DATE}</p>
          <span
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${
              tooltip.festival.IS_FREE === '무료'
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {tooltip.festival.IS_FREE}
          </span>
        </div>
      </div>

      {/* 툴팁 화살표 */}
      <div className="flex justify-center">
        <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white" />
      </div>
    </div>
  );
};

export type { TooltipState };
