import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const RightSectionContainer = ({ children, className = "" }: ContainerProps) => {
  return (
    <section
      style={{
        borderColor: 'var(--card-border)',
      }}
      className={`h-auto md:h-[calc(100vh-200px)] min-h-0 md:min-h-206 w-full md:w-[40%] md:min-w-146 2xl:max-w-200 flex flex-col items-center border rounded-none md:rounded-tl-[40px] md:rounded-bl-[40px] relative ${className} p-4 md:p-12 scrollbar-hide`}
    >
      {children}
    </section>
  );
};

export { RightSectionContainer };
