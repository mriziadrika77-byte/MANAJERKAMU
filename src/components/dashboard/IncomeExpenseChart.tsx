import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { MONTHLY_ANALYTICS_DATA } from '@/data/mockData';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from '@/theme/ThemeContext';

export const IncomeExpenseChart: React.FC = () => {
  const [period, setPeriod] = useState<'3m' | '6m' | '1y'>('6m');
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const chartData = React.useMemo(() => {
    if (period === '3m') {
      return MONTHLY_ANALYTICS_DATA.slice(-3);
    }
    return MONTHLY_ANALYTICS_DATA;
  }, [period]);

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border shadow-elevated rounded-xl p-3 text-xs space-y-1.5 z-50">
          <p className="font-heading font-bold text-content-primary mb-1 border-b border-border pb-1">
            Periode: {label}
          </p>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-content-secondary">
              <span className="w-2.5 h-2.5 rounded-sm bg-brand-navy dark:bg-brand-blue" />
              Pemasukan (Income):
            </span>
            <span className="font-mono font-bold text-brand-navy dark:text-brand-blue">
              {formatCurrency(payload[0]?.value || 0)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-content-secondary">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400" />
              Pengeluaran (Expense):
            </span>
            <span className="font-mono font-bold text-rose-500">
              {formatCurrency(payload[1]?.value || 0)}
            </span>
          </div>
          {payload[0] && payload[1] && (
            <div className="flex items-center justify-between gap-4 pt-1 border-t border-border/60">
              <span className="text-content-muted">Laba Bersih (Net):</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(payload[0].value - payload[1].value)}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="lg:col-span-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="font-heading text-base sm:text-lg font-bold text-content-primary">
            Income and Expense Chart
          </h3>
          <p className="text-xs text-content-muted">
            Perbandingan tren pemasukan vs pengeluaran operasional per bulan
          </p>
        </div>

        {/* Period Filter Buttons */}
        <div className="flex items-center bg-surface-elevated/60 border border-border rounded-lg p-1 text-xs self-start sm:self-auto">
          <button
            onClick={() => setPeriod('3m')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              period === '3m'
                ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            3 Bulan
          </button>
          <button
            onClick={() => setPeriod('6m')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              period === '6m'
                ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            6 Bulan
          </button>
          <button
            onClick={() => setPeriod('1y')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
              period === '1y'
                ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                : 'text-content-muted hover:text-content-primary'
            }`}
          >
            1 Tahun
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={isDark ? '#2B3852' : '#E7EAF3'}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#A1ADC4' : '#778198', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#A1ADC4' : '#778198', fontSize: 11 }}
              tickFormatter={(v) => `${v / 1000000}M`}
            />
            <Tooltip content={customTooltip} cursor={{ fill: isDark ? '#202C45' : '#F2F3FC', opacity: 0.5 }} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar
              name="Pemasukan (Income)"
              dataKey="income"
              fill={isDark ? '#7895F0' : '#243B80'}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              name="Pengeluaran (Expense)"
              dataKey="expense"
              fill={isDark ? '#F87171' : '#F43F5E'}
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

