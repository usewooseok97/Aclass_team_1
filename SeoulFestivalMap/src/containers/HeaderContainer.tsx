interface HeaderProps {
  children: React.ReactNode;
  backgroundElement?: React.ReactNode;
}

const HeaderContainer = ({ children, backgroundElement }: HeaderProps) => {
  return (
    <header className="w-full h-24 lg:h-32 relative overflow-hidden">
      {/* 배경 (TimetoScrolling) */}
      {backgroundElement && (
        <div className="absolute inset-0">
          {backgroundElement}
        </div>
      )}

      {/* 데스크톱 컨텐츠 */}
      <div className="hidden lg:flex relative z-10 h-full px-4 flex-row justify-between items-center">
        {children}
      </div>
    </header>
  );
};

export { HeaderContainer };
