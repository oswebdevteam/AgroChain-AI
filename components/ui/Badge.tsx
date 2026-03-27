import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'mint' | 'gold' | 'ink' | 'danger' | 'ghost';
}

export function Badge({
  className,
  variant = 'mint',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    mint: 'bg-(--color-mint)/10 text-(--color-mint) border-(--color-mint)/20',
    gold: 'bg-(--color-gold)/10 text-(--color-gold) border-(--color-gold)/20',
    ink: 'bg-(--color-ink) text-white border-white/10',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    ghost: 'bg-white/5 text-white/70 border-white/10',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
