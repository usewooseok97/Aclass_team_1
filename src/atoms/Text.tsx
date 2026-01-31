import { cn } from '@lib/utils';

type TextVariant = 'title' | 'content' | 'footer';

interface TextProps {
  variant: TextVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  title: "w-full h-8 text-center font-semibold text-[28px] font-['Roboto']",
  content: "w-[495px] flex items-center leading-8 font-semibold text-[24px] font-['Roboto'] whitespace-pre-line",
  footer: "h-8 flex items-center font-semibold text-[14px] font-['Roboto']",
};

export const Text = ({ variant, children, className }: TextProps) => {
  const Tag = variant === 'title' ? 'p' : 'div';

  return (
    <Tag
      className={cn(variantStyles[variant], className)}
      style={{ color: 'var(--text-primary)' }}
    >
      {children}
    </Tag>
  );
};
