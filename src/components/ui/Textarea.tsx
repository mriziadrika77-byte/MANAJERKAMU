import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-content-primary">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full rounded-lg border bg-surface text-content-primary px-3.5 py-2.5 text-sm transition-colors duration-150',
            'placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue',
            error ? 'border-semantic-danger focus:ring-semantic-danger/30' : 'border-border',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-semantic-danger mt-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-content-muted mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

