import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const CardLayout = ({ children, className = "" }: ContainerProps ) => {
  return (
    <section
      className={`flex flex-col items-center w-[100%]  min-h-[394px] justify-center border border-black/50 rounded-tr-[40px] rounded-br-[40px] ${className}`}
    >
      {children}
    </section>
  );
};

export { CardLayout };
