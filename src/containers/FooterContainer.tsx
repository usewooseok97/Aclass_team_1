interface HeaderProps {
  children: React.ReactNode;
}

const FooterContainer = ({ children }: HeaderProps) => {
  return (
    <footer className="w-full h-12 lg:h-25 px-4 bg-transparent flex flex-row justify-between items-center">
      {/* 데스크톱 컨텐츠 */}
      <div className="hidden lg:contents">
        {children}
      </div>
    </footer>
  );
};

export { FooterContainer };
