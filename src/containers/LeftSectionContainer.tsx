interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LeftSectionContainer = ({ children, className = "" }: ContainerProps) => {
  return (
    <section
      className={`h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col justify-between items-center rounded-tr-[40px] rounded-br-[40px] relative scrollbar-hide ${className} `}
    >
      {children}
    </section>
  );
};

export { LeftSectionContainer };
