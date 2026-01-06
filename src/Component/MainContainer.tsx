interface ContainerProps {
  children: React.ReactNode;
}

const MainContainer = ({ children }: ContainerProps) => {
  return (
    <main className="max-w-7xl mx-auto flex flex-col">
      {children}
    </main>
  );
};

export default MainContainer;
