import { cn } from '@lib/utils';

interface TextLinkProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TextLink = ({ children, onClick, className }: TextLinkProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-sm text-gray-500 hover:text-purple-600 underline cursor-pointer bg-transparent border-none transition-colors',
        className
      )}
      style={{
        color: 'var(--text-secondary)',
      }}
    >
      {children}
    </button>
  );
};
