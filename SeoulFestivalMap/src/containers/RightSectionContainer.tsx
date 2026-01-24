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
      className={`h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col items-center border rounded-tl-[40px] rounded-bl-[40px] relative ${className} p-12 scrollbar-hide`}
    >
      {children}
    </section>
  );
};

export { RightSectionContainer };
