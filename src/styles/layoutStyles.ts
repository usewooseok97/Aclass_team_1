export const sectionStyles = {
  left: 'h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col justify-between items-center rounded-tr-[40px] rounded-br-[40px]',
  right: 'h-[calc(100vh-200px)] min-h-206 w-[40%] sm:w-[60%] lg:w-[40%] 2xl:max-w-200 min-w-146 flex flex-col items-center border rounded-tl-[40px] rounded-bl-[40px] p-12',
  header: 'w-full py-4 px-6',
  footer: 'w-full py-4 px-6 text-center',
} as const;

export const cardStyles = {
  base: 'rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4',
  festival: 'w-114 h-12.5 rounded-[20px] flex items-center px-4 cursor-pointer hover:shadow-lg transition-shadow',
} as const;
