import React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  className,
  emptyMessage = 'Tidak ada data ditemukan',
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-card border border-border bg-surface', className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-brand-mist/40 dark:bg-surface-elevated/40">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={cn('py-3.5 px-4 font-semibold text-xs text-content-secondary uppercase tracking-wider', col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-8 text-center text-content-muted text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item, index)}
                className="hover:bg-brand-mist/20 dark:hover:bg-surface-elevated/50 transition-colors"
              >
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={cn('py-3 px-4 text-content-primary', col.className)}>
                    {col.cell
                      ? col.cell(item)
                      : col.accessorKey
                      ? String(item[col.accessorKey] ?? '')
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

