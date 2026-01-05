interface ContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <main
      className="flex flex-row flex-wrap "
      style={{ gap: 'clamp(80px, 118px)' }}
    >
      {children}
    </main>
  );
};

export default MainContainer;
