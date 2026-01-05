import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const RightCardComponent = ({ children, className = "" }: ContainerProps) => {
  return (
    <section
      className={`h-[calc(100vh-200px)] min-h-[824px] w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-[800px] min-w-[584px] mx-auto flex flex-col items-center justify-center border border-black/50 rounded-tl-[40px] rounded-bl-[40px] ${className}`}
    >
      {children}
    </section>
  );
};

export default RightCardComponent;
