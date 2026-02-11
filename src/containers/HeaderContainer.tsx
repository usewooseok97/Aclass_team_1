import { SearchInput } from '@/components/SearchInput';
import { AuthButton } from '@/components/AuthButton';

interface HeaderProps {
  children: React.ReactNode;
  backgroundElement?: React.ReactNode;
}

const HeaderContainer = ({ children, backgroundElement }: HeaderProps) => {
  return (
    <header className="w-full h-14 md:h-32 relative">
      {/* 배경 (TimetoScrolling) */}
      {backgroundElement && (
        <div className="absolute inset-0">
          {backgroundElement}
        </div>
      )}

      {/* 모바일 헤더: 검색 + 로그인만 표시 */}
      <div className="flex md:hidden relative z-10 h-full px-3 items-center gap-2">
        <SearchInput className="flex-1 min-w-0" />
        <AuthButton />
      </div>

      {/* 데스크톱 헤더 */}
      <div className="hidden md:flex relative z-10 h-full px-4 flex-row justify-between items-center">
        {children}
      </div>
    </header>
  );
};

export { HeaderContainer };
