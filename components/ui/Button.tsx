import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'mint' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading,
  asChild = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const variants = {
    primary: 'bg-(--color-mint) text-(--color-ink) hover:shadow-[0_8px_20px_rgba(46,204,113,0.3)]',
    secondary: 'bg-(--color-forest) text-white border border-white/10 hover:border-white/30',
    ghost: 'bg-transparent text-white hover:bg-white/5',
    danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
    gold: 'bg-(--color-gold) text-(--color-forest) hover:shadow-[0_8px_20px_rgba(240,192,64,0.3)]',
    mint: 'bg-(--color-mint) text-(--color-ink) hover:shadow-[0_8px_20px_rgba(46,204,113,0.3)]',
    outline: 'bg-transparent text-white border border-white/10 hover:border-white/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {isLoading && (
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {children}
        </>
      )}
    </Comp>
  );
}
