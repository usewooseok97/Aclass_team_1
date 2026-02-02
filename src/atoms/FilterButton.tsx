import { type ReactNode } from 'react';
import { cn } from '@lib/utils';

interface FilterButtonProps {
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  title?: string;
}

export const FilterButton = ({
  children,
  onClick,
  isActive = false,
  disabled = false,
  className,
  type = 'button',
  title,
}: FilterButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
        isActive
          ? 'bg-purple-600 text-white shadow-md'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        ...(isActive && {
          backgroundColor: 'var(--btn-primary)',
        }),
      }}
    >
      {children}
    </button>
  );
};
