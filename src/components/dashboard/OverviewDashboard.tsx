import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Tooltip } from '@/components/ui/Tooltip';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { QuickActionModals, QuickModalType } from './QuickActionModals';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  PiggyBank,
  Clock,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const OverviewDashboard: React.FC = () => {
  const {
    user,
    financialMetrics,
    activityMetrics,
    workloadMetrics,
    activities,
    incomeTransactions,
    expenseTransactions,
    setActivePage,
    setSelectedActivityId,
  } = useApp();

  const [dateRange, setDateRange] = useState<string>('month');
  const [activeModal, setActiveModal] = useState<QuickModalType>(null);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  // Top Performing Activities sorted by Net Income descending (PRD Section 3.E)
  const topActivities = [...activities].sort((a, b) => {
    const netA = a.actualIncome - a.actualExpense;
    const netB = b.actualIncome - b.actualExpense;
    return netB - netA;
  });

  // Recent 5 transactions combining income & expense (PRD Section 3.F)
  const recentCombinedTransactions = [
    ...incomeTransactions.map((i) => ({
      id: i.id,
      description: i.description,
      activityName: i.activityName || 'General',
      date: i.date,
      type: 'income' as const,
      amount: i.receivedAmount,
      status: i.paymentStatus,
    })),
    ...expenseTransactions.map((e) => ({
      id: e.id,
      description: e.description,
      activityName: e.activityName || 'General',
      date: e.date,
      type: 'expense' as const,
      amount: e.amount,
      status: 'Paid' as const,
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 3.A DASHBOARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-navy dark:text-brand-blue bg-brand-mist dark:bg-brand-tint px-2.5 py-0.5 rounded-full border border-brand-soft/30">
              Live Overview
            </span>
            <span className="text-xs text-content-muted">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-content-primary">
            {getGreeting()}, {user.name}!
          </h1>
          <p className="text-sm text-content-secondary mt-1">
            One Person. Multiple Activities. One Integrated System. Berikut ikhtisar kondisi kerja dan keuangan Anda.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          {/* Date range filter */}
          <div className="flex items-center bg-surface border border-border rounded-lg p-1 text-xs font-medium">
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateRange === 'week'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Minggu Ini
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateRange === 'month'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                dateRange === 'year'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Tahun Ini
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-surface border border-border shadow-subtle">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-blue shrink-0" />
          <span className="text-xs sm:text-sm font-semibold text-content-primary">
            Tindakan Cepat (Quick Actions):
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-brand-blue" />}
            onClick={() => setActiveModal('activity')}
          >
            Add Activity
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-500" />}
            onClick={() => setActiveModal('income')}
          >
            Add Income
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-rose-500" />}
            onClick={() => setActiveModal('expense')}
          >
            Add Expense
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
            onClick={() => setActiveModal('schedule')}
          >
            Create Schedule
          </Button>
        </div>
      </div>

      {/* 3.B FINANCIAL OVERVIEW CARDS (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* 1. Total Income */}
        <Card hoverable className="relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-content-secondary">Total Income</span>
                <Tooltip content="Total pembayaran yang benar-benar diterima (kas masuk)">
                  <span className="cursor-help text-content-muted text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-content-primary mt-2">
                {formatCurrency(financialMetrics.totalIncome)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +{financialMetrics.incomeGrowthPercentage}%
            </span>
            <span className="text-content-muted">vs bulan lalu</span>
          </div>
        </Card>

        {/* 2. Total Expenses */}
        <Card hoverable className="relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-content-secondary">Total Expenses</span>
                <Tooltip content="Akumulasi seluruh pengeluaran operasional dan biaya modal kerja">
                  <span className="cursor-help text-content-muted text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-content-primary mt-2">
                {formatCurrency(financialMetrics.totalExpense)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" /> {financialMetrics.expenseGrowthPercentage}%
            </span>
            <span className="text-content-muted">biaya operasional</span>
          </div>
        </Card>

        {/* 3. Net Income */}
        <Card hoverable className="relative overflow-hidden group border-brand-soft/60">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-brand-navy dark:text-brand-blue">
                  Net Income
                </span>
                <Tooltip content="Pendapatan bersih riil (Total Income - Total Expense)">
                  <span className="cursor-help text-brand-blue text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-navy dark:text-brand-blue mt-2">
                {formatCurrency(financialMetrics.netIncome)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-mist dark:bg-brand-tint text-brand-navy dark:text-brand-blue flex items-center justify-center shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +{financialMetrics.netGrowthPercentage}%
            </span>
            <span className="text-content-muted">
              Margin ~{financialMetrics.totalIncome > 0 ? Math.round((financialMetrics.netIncome / financialMetrics.totalIncome) * 100) : 0}%
            </span>
          </div>
        </Card>

        {/* 4. Outstanding Payments */}
        <Card hoverable className="relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-content-secondary">
                  Outstanding Payments
                </span>
                <Tooltip content="Total sisa tagihan termin invoice yang belum dilunasi klien">
                  <span className="cursor-help text-content-muted text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
                {formatCurrency(financialMetrics.outstandingPayments)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              {financialMetrics.pendingCount + financialMetrics.partiallyPaidCount} Invoice Pending
            </span>
            <span className="text-content-muted">Estimasi cair Nov</span>
          </div>
        </Card>
      </div>

      {/* 3.C & 3.D: CHART + ACTIVITY OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3.C Income & Expense Recharts */}
        <IncomeExpenseChart />

        {/* 3.D Activity Overview Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-content-primary">
                  Activity Overview
                </h3>
                <p className="text-xs text-content-muted">Status &amp; kontribusi portofolio pekerjaan</p>
              </div>
              <button
                onClick={() => setActivePage('activities')}
                className="text-xs font-semibold text-brand-blue hover:underline flex items-center gap-0.5"
              >
                Portofolio <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Total / Active / Completed / Paused Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="p-3 rounded-xl bg-surface-elevated/60 border border-border">
                <span className="text-[11px] text-content-muted block">Total Activities</span>
                <span className="font-heading text-xl font-bold text-content-primary">
                  {activityMetrics.total}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">
                  Active
                </span>
                <span className="font-heading text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {activityMetrics.active}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40">
                <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-medium">
                  Completed
                </span>
                <span className="font-heading text-xl font-bold text-blue-700 dark:text-blue-300">
                  {activityMetrics.completed}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40">
                <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">
                  Paused
                </span>
                <span className="font-heading text-xl font-bold text-amber-700 dark:text-amber-300">
                  {activityMetrics.paused}
                </span>
              </div>
            </div>

            {/* Contribution Breakdown */}
            <h4 className="text-xs font-semibold text-content-primary mb-2.5">
              Kontribusi Pendapatan Bersih (Net):
            </h4>
            <div className="space-y-3">
              {activities.slice(0, 3).map((act) => {
                const net = act.actualIncome - act.actualExpense;
                const totalNetAll = financialMetrics.netIncome || 1;
                const pct = Math.max(0, Math.round((net / totalNetAll) * 100));

                return (
                  <div key={act.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-content-primary truncate max-w-[65%]">
                        {act.name}
                      </span>
                      <span className="font-mono font-bold text-content-primary">{pct}%</span>
                    </div>
                    <div className="w-full bg-surface-elevated border border-border rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-brand-navy dark:bg-brand-blue h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs text-content-muted">
            <span>Kategori: 4 Segmen PRD</span>
            <span className="font-semibold text-brand-blue">Terintegrasi</span>
          </div>
        </Card>
      </div>

      {/* 3.E TOP PERFORMING ACTIVITIES */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-content-primary">
              Top Performing Activities
            </h3>
            <p className="text-xs text-content-muted">
              Peringkat aktivitas berdasarkan kontribusi pendapatan bersih (Net Income) tertinggi
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            onClick={() => setActivePage('activities')}
          >
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-brand-mist/30 dark:bg-surface-elevated/40 text-content-secondary uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Nama Aktivitas</th>
                <th className="py-3 px-4 font-semibold">Kategori</th>
                <th className="py-3 px-4 font-semibold">Total Income</th>
                <th className="py-3 px-4 font-semibold">Total Expenses</th>
                <th className="py-3 px-4 font-semibold">Net Income</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topActivities.map((act) => {
                const net = act.actualIncome - act.actualExpense;
                return (
                  <tr
                    key={act.id}
                    onClick={() => {
                      setSelectedActivityId(act.id);
                      setActivePage('activities');
                    }}
                    className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-content-primary">{act.name}</p>
                      <p className="text-[11px] text-content-muted">{act.clientOrPlatform}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant="default" size="sm">
                        {act.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(act.actualIncome)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-rose-500">
                      {formatCurrency(act.actualExpense)}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-navy dark:text-brand-blue">
                      {formatCurrency(net)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          act.status === 'Active'
                            ? 'success'
                            : act.status === 'Completed'
                            ? 'info'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {act.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3.F RECENT TRANSACTIONS */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-content-primary">
              Recent Transactions
            </h3>
            <p className="text-xs text-content-muted">
              Pencatatan mutasi mutakhir pemasukan dan pengeluaran operasional
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            onClick={() => setActivePage('income-expenses')}
          >
            View All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-brand-mist/30 dark:bg-surface-elevated/40 text-content-secondary uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 font-semibold">Transaction</th>
                <th className="py-3 px-4 font-semibold">Activity</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentCombinedTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-content-primary">
                    {tx.description}
                  </td>
                  <td className="py-3.5 px-4 text-brand-blue font-medium">{tx.activityName}</td>
                  <td className="py-3.5 px-4 text-content-muted font-mono">{tx.date}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-4 font-mono font-bold ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-content-primary'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        tx.status === 'Paid'
                          ? 'success'
                          : tx.status === 'Pending'
                          ? 'danger'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3.G FINANCIAL TARGET & 3.H WORKLOAD SNAPSHOT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 3.G Financial Target Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-content-primary">
                  Financial Target
                </h3>
                <p className="text-xs text-content-muted">Target capaian pendapatan bulanan</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActivePage('financial-planning')}
                className="text-xs text-brand-blue"
              >
                Atur Target <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[11px] text-content-muted block">Monthly Income Target</span>
                <span className="font-heading text-base sm:text-lg font-bold text-content-primary">
                  {formatCurrency(user.monthlyTarget)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-brand-mist/50 dark:bg-brand-tint border border-brand-soft/40">
                <span className="text-[11px] text-brand-navy dark:text-brand-blue block font-medium">
                  Actual Received
                </span>
                <span className="font-heading text-base sm:text-lg font-bold text-brand-navy dark:text-brand-blue">
                  {formatCurrency(financialMetrics.totalIncome)}
                </span>
              </div>
            </div>

            {/* Target Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-content-primary">Target Achievement</span>
                <span className="font-mono font-bold text-brand-navy dark:text-brand-blue">
                  {financialMetrics.targetAchievementRate}%
                </span>
              </div>
              <div className="w-full bg-surface-elevated border border-border rounded-full h-3 overflow-hidden">
                <div
                  className="bg-brand-navy dark:bg-brand-blue h-full rounded-full transition-all duration-500"
                  style={{ width: `${financialMetrics.targetAchievementRate}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-content-muted pt-1">
                <span>Tercapai: {formatCurrency(financialMetrics.totalIncome)}</span>
                <span>Sisa Target: {formatCurrency(financialMetrics.remainingTarget)}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-surface-elevated/60 border border-border flex items-center gap-2 text-xs text-content-secondary">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Target bulanan berada pada lintasan positif menjelang akhir periode.</span>
          </div>
        </Card>

        {/* 3.H Workload Snapshot Card */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading text-base font-bold text-content-primary">
                  Workload Snapshot
                </h3>
                <p className="text-xs text-content-muted">Alokasi jam kerja &amp; distribusi beban waktu</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePage('schedule')}
                className="text-xs"
              >
                Workload &amp; Schedule
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[10px] sm:text-[11px] text-content-muted block">Total Hours</span>
                <span className="font-heading text-lg font-bold text-content-primary">
                  {workloadMetrics.totalHours} Jam
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[10px] sm:text-[11px] text-content-muted block">Active Tasks</span>
                <span className="font-heading text-lg font-bold text-content-primary">
                  {workloadMetrics.activeTasks} Tugas
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-[10px] sm:text-[11px] text-content-muted block">Upcoming Deadlines</span>
                <span className="font-heading text-lg font-bold text-amber-600 dark:text-amber-400">
                  {workloadMetrics.upcomingDeadlines} Agenda
                </span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-content-secondary">Kapasitas Waktu Mingguan:</span>
                <span className="font-bold text-content-primary">
                  {workloadMetrics.capacityPercentage}% ({workloadMetrics.maxCapacityHours} Jam Maksimal)
                </span>
              </div>
              <div className="w-full bg-surface-elevated border border-border rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${workloadMetrics.capacityPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/30 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" /> {workloadMetrics.scheduleConflicts} Benturan Jadwal Terdeteksi
            </span>
            <button
              onClick={() => setActivePage('schedule')}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 underline"
            >
              Cek Kalender
            </button>
          </div>
        </Card>
      </div>

      {/* QUICK ACTION MODALS */}
      <QuickActionModals modalType={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
};
