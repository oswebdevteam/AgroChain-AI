import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  className,
  label,
  error,
  id,
  type = 'text',
  icon,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-wider text-white/50"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            'flex h-12 w-full rounded-2xl border border-white/10 bg-(--color-forest) px-4 py-2 text-sm text-white placeholder:text-white/20 focus:border-(--color-mint) focus:outline-none focus:ring-1 focus:ring-(--color-mint) disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
            icon && 'pl-11',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
