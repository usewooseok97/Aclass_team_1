import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Containers= ({ children, className = "" }: ContainerProps ) => {
  return (
    <section
      className={`flex flex-col items-center justify-center sm:w-[60%] lg:w-[40%] 2xl:max-w-[800px] mx-auto border border-black/50 rounded-tl-[40px] rounded-bl-[40px] ${className}`}
    >
      {children}
    </section>
  );
};

export default Containers;
