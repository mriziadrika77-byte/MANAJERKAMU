import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { MONTHLY_ANALYTICS_DATA } from '@/data/mockData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Calendar,
  Printer,
} from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';

export const AnalyticsModule: React.FC = () => {
  const {
    activities,
    incomeTransactions,
    expenseTransactions,
    financialMetrics,
  } = useApp();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // 5.F Filter & Period Selection
  const [period, setPeriod] = useState<string>('month');

  // Activity Performance Analytics (PRD 5.D)
  const activityPerformance = activities.map((act) => {
    const net = act.actualIncome - act.actualExpense;
    const margin = act.actualIncome > 0 ? Math.round((net / act.actualIncome) * 100) : 0;
    const revPerHour = act.hoursWorked > 0 ? Math.round(act.actualIncome / act.hoursWorked) : 0;

    return {
      ...act,
      net,
      margin,
      revPerHour,
    };
  });

  // Expense breakdown by Category for Donut Chart
  const expenseByCategory = React.useMemo(() => {
    const map: Record<string, number> = {};
    expenseTransactions.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [expenseTransactions]);

  const PIE_COLORS = ['#4169E1', '#16A477', '#D99736', '#DC626F', '#7895F0', '#3153B5', '#A8B8F0'];

  // 5.G REPORT GENERATION & CSV EXPORT
  const handleExportCSV = () => {
    const headers = ['Trx ID', 'Tipe', 'Deskripsi', 'Aktivitas', 'Tanggal', 'Nominal (IDR)', 'Status/Kategori'];
    const rows = [
      ...incomeTransactions.map((i) => [
        i.id,
        'Income',
        `"${i.description}"`,
        `"${i.activityName || 'General'}"`,
        i.date,
        i.receivedAmount,
        i.paymentStatus,
      ]),
      ...expenseTransactions.map((e) => [
        e.id,
        'Expense',
        `"${e.description}"`,
        `"${e.activityName || 'General'}"`,
        e.date,
        e.amount,
        e.category,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MANAJERKAMU_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Analytics & Financial Reports"
        description="Laporan komprehensif metrik performa pekerjaan, rasio efisiensi jam kerja, dan ekspor laporan keuangan terpadu."
        breadcrumb={<span>Intelligence / Analytics &amp; Reports</span>}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrintReport}
            >
              Cetak Laporan
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Download className="w-4 h-4" />}
              onClick={handleExportCSV}
            >
              Ekspor Laporan (CSV)
            </Button>
          </div>
        }
      />

      {/* 5.F Period Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-surface border border-border shadow-subtle">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-brand-blue" />
          <span className="text-xs sm:text-sm font-semibold text-content-primary">
            Filter Rentang Waktu Laporan:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium bg-surface-elevated/60 p-1 rounded-lg border border-border">
          {['week', 'month', 'last-month', '3m', 'year'].map((p) => {
            const labels: Record<string, string> = {
              week: 'This Week',
              month: 'This Month',
              'last-month': 'Last Month',
              '3m': 'Last 3 Months',
              year: 'This Year',
            };
            return (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  period === p
                    ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                    : 'text-content-muted hover:text-content-primary'
                }`}
              >
                {labels[p]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5.A ANALYTICS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Total Income</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-content-primary mt-1 block font-mono truncate">
            {formatCurrency(financialMetrics.totalIncome)}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-rose-500 block font-medium">Total Expenses</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-rose-500 mt-1 block font-mono truncate">
            {formatCurrency(financialMetrics.totalExpense)}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-brand-navy dark:text-brand-blue block font-semibold">Net Income</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-brand-navy dark:text-brand-blue mt-1 block font-mono truncate">
            {formatCurrency(financialMetrics.netIncome)}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Profit Margin</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {financialMetrics.totalIncome > 0 ? Math.round((financialMetrics.netIncome / financialMetrics.totalIncome) * 100) : 0}%
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Revenue / Jam</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-content-primary mt-1 block font-mono truncate">
            {formatCurrency(financialMetrics.revenuePerHour)}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Active Portfolios</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-content-primary mt-1 block">
            {activities.length} Aktivitas
          </span>
        </Card>
      </div>

      {/* 5.B & 5.C CHARTS ROW: Income Trend & Expense by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <Card className="lg:col-span-2">
          <h3 className="font-heading text-base font-bold text-content-primary mb-1">
            Tren Arus Kas Bulanan (Monthly Cashflow Trend)
          </h3>
          <p className="text-xs text-content-muted mb-4">
            Perbandingan pemasukan vs pengeluaran terdistribusi per bulan
          </p>
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_ANALYTICS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#2B3852' : '#E7EAF3'} />
                <XAxis dataKey="month" stroke={isDark ? '#A1ADC4' : '#778198'} fontSize={12} />
                <YAxis stroke={isDark ? '#A1ADC4' : '#778198'} fontSize={11} tickFormatter={(v) => `${v / 1000000}M`} />
                <Tooltip
                  formatter={(val: any) => formatCurrency(Number(val))}
                  contentStyle={{
                    backgroundColor: isDark ? '#182238' : '#FFFFFF',
                    borderColor: isDark ? '#2B3852' : '#E7EAF3',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }} />
                <Bar name="Income" dataKey="income" fill={isDark ? '#7895F0' : '#243B80'} radius={[4, 4, 0, 0]} />
                <Bar name="Expense" dataKey="expense" fill="#DC626F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Category Donut / Breakdown */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="font-heading text-base font-bold text-content-primary mb-1">
              Komposisi Pengeluaran
            </h3>
            <p className="text-xs text-content-muted mb-3">Distribusi biaya menurut kategori operasional</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2">
              {expenseByCategory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-content-secondary truncate">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="font-mono font-semibold text-content-primary">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* 5.D ACTIVITY PERFORMANCE ANALYTICS TABLE */}
      <Card className="overflow-hidden p-0">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-content-primary">
              Analisis Efisiensi &amp; Profitabilitas Aktivitas
            </h3>
            <p className="text-xs text-content-muted">
              Evaluasi mendalam rasio pendapatan per jam kerja (Revenue / Hour) dan margin laba bersih
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-brand-mist/40 dark:bg-surface-elevated/40 text-content-secondary uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Nama Aktivitas</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold">Total Income</th>
                <th className="py-3 px-4 font-semibold">Total Expenses</th>
                <th className="py-3 px-4 font-semibold">Net Income</th>
                <th className="py-3 px-4 font-semibold">Margin (%)</th>
                <th className="py-3 px-4 font-semibold">Jam Kerja</th>
                <th className="py-3 px-4 font-semibold">Revenue / Jam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activityPerformance.map((act) => (
                <tr key={act.id} className="hover:bg-brand-mist/20 dark:hover:bg-surface-elevated/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-content-primary">
                    {act.name}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="default" size="sm">{act.category}</Badge>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(act.actualIncome)}
                  </td>
                  <td className="py-3 px-4 font-mono text-rose-500">
                    {formatCurrency(act.actualExpense)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-brand-navy dark:text-brand-blue">
                    {formatCurrency(act.net)}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    <span className={act.margin >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}>
                      {act.margin}%
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-content-secondary">
                    {act.hoursWorked} Jam
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-content-primary">
                    {formatCurrency(act.revPerHour)}/Jam
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

