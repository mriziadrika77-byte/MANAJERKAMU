import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  breadcrumb,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border', className)}>
      <div className="space-y-1">
        {breadcrumb && <div className="text-xs text-content-muted mb-1">{breadcrumb}</div>}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-content-primary">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-content-secondary max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
};

