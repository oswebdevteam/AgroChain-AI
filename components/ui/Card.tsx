import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'outline';
}

export function Card({
  className,
  variant = 'outline',
  children,
  ...props
}: CardProps) {
  const variants = {
    glass: 'bg-white/5 backdrop-blur-sm border-white/10',
    solid: 'bg-(--color-ink) border-white/10',
    outline: 'bg-transparent border-white/10',
  };

  return (
    <div
      className={cn(
        'rounded-[2rem] border p-6 transition-all duration-300',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
