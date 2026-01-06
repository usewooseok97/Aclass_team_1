interface ContainerProps {
  children: React.ReactNode;
}
const LeftCardContainer = ({ children }: ContainerProps) => {
  return (
    <section className="h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col justify-between">
      {children}
    </section>
  );
};

export default LeftCardContainer;
