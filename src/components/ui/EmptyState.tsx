import React from 'react';
import { cn } from '@/lib/utils';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-card border border-dashed border-border bg-surface/50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-brand-mist dark:bg-brand-tint flex items-center justify-center text-brand-navy dark:text-brand-blue mb-4">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h4 className="font-heading text-base font-semibold text-content-primary mb-1">{title}</h4>
      <p className="text-sm text-content-muted max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

