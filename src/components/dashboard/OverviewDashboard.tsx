import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
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
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const OverviewDashboard: React.FC = () => {
  const {
    user,
    financialMetrics,
    workloadMetrics,
    activities,
    incomeTransactions,
    expenseTransactions,
    setActivePage,
    setSelectedActivityId,
  } = useApp();

  const [dateRange, setDateRange] = useState<string>('month');
  const [activeModal, setActiveModal] = useState<QuickModalType>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const topActivities = [...activities].sort((a, b) => {
    const netA = a.actualIncome - a.actualExpense;
    const netB = b.actualIncome - b.actualExpense;
    return netB - netA;
  });

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

  const netMargin =
    financialMetrics.totalIncome > 0
      ? Math.round((financialMetrics.netIncome / financialMetrics.totalIncome) * 100)
      : 0;

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200">
      {/* 3.A DASHBOARD HEADER + QUICK ACTION COMPACT INTEGRATION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-navy dark:text-brand-blue bg-brand-mist dark:bg-brand-tint px-2.5 py-0.5 rounded-full border border-brand-soft/30">
              Personal Command Center
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
          <p className="text-xs sm:text-sm text-content-secondary mt-0.5">
            Ikhtisar performa kerja multi-aktivitas dan laba bersih Anda.
          </p>
        </div>

        {/* Action Toolbar: Filter + Compact Add Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <div className="flex items-center bg-surface border border-border rounded-xl p-1 text-xs font-semibold shadow-xs">
            <button
              onClick={() => setDateRange('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'week'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Minggu
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'month'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Bulan
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'year'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Tahun
            </button>
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-brand-blue" />}
            onClick={() => setActiveModal('activity')}
          >
            Aktivitas
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-600" />}
            onClick={() => setActiveModal('income')}
          >
            Pemasukan
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
            onClick={() => setActiveModal('schedule')}
          >
            Jadwal
          </Button>
        </div>
      </div>

      {/* 3.B FINANCIAL OVERVIEW CARDS: PROMINENT HERO NET INCOME */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* HERO CARD: NET INCOME (PRD Revisi v2.0 Rule: Net Income must be visual anchor) */}
        <div className="lg:col-span-5 rounded-card p-5 sm:p-6 bg-gradient-to-br from-[#243B80] to-[#1a2c63] text-white shadow-card flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle background ambient ring */}
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide text-soft-lavender uppercase">
                Laba Bersih Utama (Net Income)
              </span>
              <span className="p-2 rounded-xl bg-white/10 text-soft-lavender">
                <PiggyBank className="w-5 h-5" />
              </span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 tabular-nums">
              {formatCurrency(financialMetrics.netIncome)}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Hasil bersih dari penerimaan kas dikurangi seluruh biaya operasional.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <TrendingUp className="w-4 h-4" />
              <span>+{financialMetrics.netGrowthPercentage}% vs lalu</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white font-semibold text-[11px]">
              Margin: {netMargin}%
            </span>
          </div>
        </div>

        {/* 3 SECONDARY METRIC CARDS: Total Received, Total Expenses, Outstanding */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Total Received */}
          <Card hoverable className="flex flex-col justify-between p-4 sm:p-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-content-secondary">Total Received</span>
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-content-primary mt-2 tabular-nums">
                {formatCurrency(financialMetrics.totalIncome)}
              </h3>
            </div>
            <div className="pt-2 mt-2 border-t border-border/50 text-[11px] text-content-muted flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+{financialMetrics.incomeGrowthPercentage}%</span>
              <span>kas diterima</span>
            </div>
          </Card>

          {/* 2. Total Expenses */}
          <Card hoverable className="flex flex-col justify-between p-4 sm:p-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-content-secondary">Total Expenses</span>
                <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Receipt className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-content-primary mt-2 tabular-nums">
                {formatCurrency(financialMetrics.totalExpense)}
              </h3>
            </div>
            <div className="pt-2 mt-2 border-t border-border/50 text-[11px] text-content-muted flex items-center justify-between">
              <span className="text-rose-600 dark:text-rose-400 font-bold">{financialMetrics.expenseGrowthPercentage}%</span>
              <span>biaya riil</span>
            </div>
          </Card>

          {/* 3. Outstanding Payments */}
          <Card hoverable className="flex flex-col justify-between p-4 sm:p-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-content-secondary">Outstanding</span>
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-extrabold text-amber-600 dark:text-amber-400 mt-2 tabular-nums">
                {formatCurrency(financialMetrics.outstandingPayments)}
              </h3>
            </div>
            <div className="pt-2 mt-2 border-t border-border/50 text-[11px] text-content-muted flex items-center justify-between">
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                {financialMetrics.pendingCount + financialMetrics.partiallyPaidCount} Invoice
              </span>
              <button
                onClick={() => setActivePage('income-expenses')}
                className="text-brand-blue hover:underline font-semibold"
              >
                Cek &rarr;
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* 3.C MAIN CHART & TARGET PROGRESS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts Income vs Expense Chart */}
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>

        {/* Right: Target Progress & Workload Capacity */}
        <div className="space-y-5">
          {/* Target Progress Card */}
          <Card className="p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-content-primary">
                Pencapaian Target Bulanan
              </h3>
              <Badge variant="default" size="sm">
                Nov 2026
              </Badge>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-2xl font-heading font-extrabold text-content-primary tabular-nums">
                  {financialMetrics.targetAchievementRate}%
                </span>
                <span className="text-xs text-content-muted tabular-nums">
                  Target: {formatCurrency(user.monthlyTarget)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-elevated border border-border rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-brand-blue h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, financialMetrics.targetAchievementRate)}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-content-secondary tabular-nums">
                <span>Masuk: {formatCurrency(financialMetrics.totalIncome)}</span>
                <span className="text-rose-500 font-semibold">
                  Sisa: {formatCurrency(financialMetrics.remainingTarget)}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/70">
              <button
                onClick={() => setActivePage('financial-planning')}
                className="w-full flex items-center justify-between text-xs font-semibold text-brand-blue hover:text-brand-navy dark:hover:text-brand-soft transition-colors"
              >
                <span>Buka Rencana Finansial &amp; Proyeksi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>

          {/* Workload Capacity Card */}
          <Card className="p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-content-primary">
                Kapasitas &amp; Jam Kerja
              </h3>
              {workloadMetrics.scheduleConflicts > 0 ? (
                <Badge variant="danger" size="sm">
                  {workloadMetrics.scheduleConflicts} Benturan
                </Badge>
              ) : (
                <Badge variant="success" size="sm">
                  Optimal
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-surface-elevated/60 border border-border/80">
                <span className="text-[11px] text-content-muted block">Jam Terjadwal</span>
                <span className="font-heading text-base sm:text-lg font-bold text-content-primary tabular-nums">
                  {workloadMetrics.totalHours} Jam
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-elevated/60 border border-border/80">
                <span className="text-[11px] text-content-muted block">Tugas Aktif</span>
                <span className="font-heading text-base sm:text-lg font-bold text-content-primary tabular-nums">
                  {workloadMetrics.activeTasks} Task
                </span>
              </div>
            </div>

            <div className="pt-1">
              <button
                onClick={() => setActivePage('schedule')}
                className="w-full flex items-center justify-between text-xs font-semibold text-brand-blue hover:text-brand-navy dark:hover:text-brand-soft transition-colors"
              >
                <span>Lihat Jadwal Kerja &amp; Kalender</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* 3.D ACTIVITY PORTFOLIO SUMMARY & RECENT TRANSACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Activities */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-content-primary">
                Kontribusi Aktivitas Ekonomi
              </h3>
              <p className="text-xs text-content-muted">
                Perbandingan laba bersih per portofolio kerja
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePage('activities')}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Semua
            </Button>
          </div>

          <div className="space-y-2.5">
            {topActivities.map((act) => {
              const net = act.actualIncome - act.actualExpense;
              const contribution =
                financialMetrics.netIncome > 0
                  ? Math.max(0, Math.round((net / financialMetrics.netIncome) * 100))
                  : 0;

              return (
                <div
                  key={act.id}
                  onClick={() => {
                    setSelectedActivityId(act.id);
                    setActivePage('activities');
                  }}
                  className="p-3 rounded-xl bg-surface-elevated/40 hover:bg-brand-mist/40 dark:hover:bg-brand-tint/30 border border-border/70 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs sm:text-sm text-content-primary truncate group-hover:text-brand-blue transition-colors">
                          {act.name}
                        </p>
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
                      </div>
                      <p className="text-[11px] text-content-muted mt-0.5 truncate">
                        {act.category} &bull; {act.clientOrPlatform}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-heading font-bold text-xs sm:text-sm text-brand-navy dark:text-brand-blue block tabular-nums">
                        {formatCurrency(net)}
                      </span>
                      <span className="text-[10px] text-content-muted font-medium tabular-nums">
                        {contribution}% kontribusi
                      </span>
                    </div>
                  </div>

                  {/* Visual contribution bar */}
                  <div className="w-full bg-border/40 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-brand-blue h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, contribution)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Transactions List */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-content-primary">
                Transaksi Kas Terbaru
              </h3>
              <p className="text-xs text-content-muted">
                Pencatatan kas masuk dan kas keluar terkini
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePage('income-expenses')}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Semua
            </Button>
          </div>

          <div className="space-y-2">
            {recentCombinedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated/40 border border-border/70 text-xs hover:border-brand-soft/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-content-primary truncate">{tx.description}</p>
                    <p className="text-[10px] text-content-muted truncate">
                      {tx.activityName} &bull; {tx.date}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-heading font-extrabold text-xs block tabular-nums ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                  <span className="text-[10px] text-content-muted">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Action Modals */}
      <QuickActionModals
        modalType={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
};
