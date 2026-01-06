interface HeaderProps {
  children: React.ReactNode;
}

const HeaderComponent = ({ children }: HeaderProps) => {
  return (
    <header className="w-full h-12 lg:h-25 bg-transparent flex flex-row justify-between items-center">
      {/* 모바일 햄버거 메뉴 */}
      <div className="lg:hidden flex flex-col gap-1.5 cursor-pointer">
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black"></div>
        <div className="w-6 h-0.5 bg-black"></div>
      </div>

      {/* 데스크톱 컨텐츠 */}
      <div className="hidden lg:contents">
        {children}
      </div>
    </header>
  );
};

export default HeaderComponent;