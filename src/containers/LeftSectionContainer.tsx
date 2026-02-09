interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LeftSectionContainer = ({ children, className = "" }: ContainerProps) => {
  return (
    <section
      className={`h-auto md:h-[calc(100vh-200px)] min-h-0 md:min-h-206 w-full md:w-[40%] md:min-w-146 2xl:max-w-200 flex flex-col justify-between items-center rounded-none md:rounded-tr-[40px] md:rounded-br-[40px] relative scrollbar-hide ${className}`}
    >
      {children}
    </section>
  );
};

export { LeftSectionContainer };
