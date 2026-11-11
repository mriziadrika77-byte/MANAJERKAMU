import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default:
      'bg-brand-mist text-brand-navy border-brand-soft/40 dark:bg-brand-tint dark:text-brand-blue dark:border-brand-blue/30',
    neutral:
      'bg-surface-elevated text-content-secondary border-border',
    success:
      'bg-emerald-50 text-[#16A477] border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/40 dark:text-emerald-400',
    warning:
      'bg-amber-50 text-[#D99736] border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/40 dark:text-amber-400',
    danger:
      'bg-rose-50 text-[#DC626F] border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/40 dark:text-rose-400',
    info:
      'bg-blue-50 text-[#6485C7] border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center border transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

