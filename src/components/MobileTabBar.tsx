import { Map, List } from 'lucide-react';

type MobileTab = 'map' | 'list';

interface MobileTabBarProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
}

const MobileTabBar = ({ activeTab, onTabChange }: MobileTabBarProps) => {
  return (
    <div className="md:hidden flex w-full px-4 py-2 gap-2">
      <button
        onClick={() => onTabChange('map')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'map'
            ? 'bg-white/30 backdrop-blur-sm shadow-sm'
            : 'text-white/70'
        }`}
        style={{
          color: activeTab === 'map' ? 'var(--text-primary)' : undefined,
        }}
      >
        <Map className="w-4 h-4" />
        지도
      </button>
      <button
        onClick={() => onTabChange('list')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeTab === 'list'
            ? 'bg-white/30 backdrop-blur-sm shadow-sm'
            : 'text-white/70'
        }`}
        style={{
          color: activeTab === 'list' ? 'var(--text-primary)' : undefined,
        }}
      >
        <List className="w-4 h-4" />
        목록
      </button>
    </div>
  );
};

export { MobileTabBar };
export type { MobileTab };
