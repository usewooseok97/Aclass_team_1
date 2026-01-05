interface ContainerProps {
  children: React.ReactNode;
}
const LeftCardContainer = ({ children }: ContainerProps) => {
  return (
    <section className="h-[calc(100vh-200px)] min-h-[824px] w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-[800px] min-w-[584px] mx-auto">
      {children}
    </section>
  );
};

export default LeftCardContainer;
