import type { CSSProperties } from 'react';

export const cardBgStyle: CSSProperties = {
  backgroundColor: 'var(--card-bg)',
  borderColor: 'var(--card-border)',
  borderWidth: '1px',
};

export const textStyles = {
  primary: { color: 'var(--text-primary)' } as CSSProperties,
  secondary: { color: 'var(--text-secondary)' } as CSSProperties,
  accent: { color: 'var(--btn-primary)' } as CSSProperties,
} as const;

export const iconStyles = {
  primary: { color: 'var(--btn-primary)' } as CSSProperties,
  secondary: { color: 'var(--text-secondary)' } as CSSProperties,
} as const;
