interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LeftSectionContainer = ({ children, className = "" }: ContainerProps) => {
  return (
    <section
      className={`h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col items-center border border-black/50 rounded-tr-[40px] rounded-br-[40px] ${className}`}
    >
      {children}
    </section>
  );
};

export { LeftSectionContainer };
