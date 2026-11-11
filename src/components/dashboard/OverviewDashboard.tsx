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
  ChevronRight,
  Calendar,
  Sparkles,
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

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 3.A DASHBOARD HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-brand-navy dark:text-brand-blue bg-brand-mist dark:bg-brand-tint px-2.5 py-0.5 rounded-full border border-brand-soft/30">
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
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            One Person. Multiple Activities. One Integrated System.
          </p>
        </div>

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
              Minggu Ini
            </button>
            <button
              onClick={() => setDateRange('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'month'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setDateRange('year')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                dateRange === 'year'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue shadow-xs'
                  : 'text-content-secondary hover:text-content-primary'
              }`}
            >
              Tahun Ini
            </button>
          </div>
        </div>
      </div>

      {/* 4. QUICK ACTIONS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-card bg-surface border border-border shadow-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-brand-mist dark:bg-brand-tint text-brand-blue">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-bold text-content-primary">
            Tindakan Cepat:
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-brand-blue" />}
            onClick={() => setActiveModal('activity')}
          >
            Aktivitas Baru
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-emerald-500" />}
            onClick={() => setActiveModal('income')}
          >
            Pemasukan Kas
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5 text-rose-500" />}
            onClick={() => setActiveModal('expense')}
          >
            Pengeluaran
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
            onClick={() => setActiveModal('schedule')}
          >
            Buat Jadwal
          </Button>
        </div>
      </div>

      {/* 3.B FINANCIAL OVERVIEW CARDS (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* 1. Total Income */}
        <Card hoverable className="relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-content-secondary">Total Received</span>
                <Tooltip content="Total pembayaran kas yang telah diterima">
                  <span className="cursor-help text-content-muted text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-content-primary mt-2">
                {formatCurrency(financialMetrics.totalIncome)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <TrendingUp className="w-3.5 h-3.5" /> +{financialMetrics.incomeGrowthPercentage}%
            </span>
            <span className="text-content-muted text-[11px]">vs bulan lalu</span>
          </div>
        </Card>

        {/* 2. Total Expenses */}
        <Card hoverable className="relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-content-secondary">Total Expenses</span>
                <Tooltip content="Akumulasi biaya operasional dan modal kerja">
                  <span className="cursor-help text-content-muted text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-content-primary mt-2">
                {formatCurrency(financialMetrics.totalExpense)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <TrendingDown className="w-3.5 h-3.5" /> {financialMetrics.expenseGrowthPercentage}%
            </span>
            <span className="text-content-muted text-[11px]">biaya operasional</span>
          </div>
        </Card>

        {/* 3. Net Income */}
        <Card hoverable className="relative overflow-hidden group border-brand-soft/60">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-brand-navy dark:text-brand-blue">
                  Net Income
                </span>
                <Tooltip content="Laba bersih: Total Received Income - Total Expenses">
                  <span className="cursor-help text-content-muted text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-brand-navy dark:text-brand-blue mt-2">
                {formatCurrency(financialMetrics.netIncome)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-mist dark:bg-brand-tint text-brand-navy dark:text-brand-blue flex items-center justify-center shrink-0">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="text-content-primary font-bold">
              Margin: {financialMetrics.totalIncome > 0 ? Math.round((financialMetrics.netIncome / financialMetrics.totalIncome) * 100) : 0}%
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
              +{financialMetrics.netGrowthPercentage}%
            </span>
          </div>
        </Card>

        {/* 4. Outstanding Payments */}
        <Card hoverable className="relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-content-secondary">Outstanding</span>
                <Tooltip content="Total invoice tertunda yang belum dilunasi klien">
                  <span className="cursor-help text-content-muted text-xs">&bull;</span>
                </Tooltip>
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
                {formatCurrency(financialMetrics.outstandingPayments)}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60 text-xs">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              {financialMetrics.pendingCount + financialMetrics.partiallyPaidCount} Invoice
            </span>
            <button
              onClick={() => setActivePage('income-expenses')}
              className="text-brand-blue hover:underline text-[11px] font-semibold"
            >
              Lihat Kas &rarr;
            </button>
          </div>
        </Card>
      </div>

      {/* 3.C MAIN CHART & TARGET PROGRESS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recharts Income vs Expense Chart */}
        <div className="lg:col-span-2">
          <IncomeExpenseChart />
        </div>

        {/* Right: Target & Workload Status */}
        <div className="space-y-6">
          {/* Target Progress Card */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-content-primary">
                Pencapaian Target Bulanan
              </h3>
              <Badge variant="default" size="sm">
                Nov 2026
              </Badge>
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-2xl font-heading font-extrabold text-content-primary">
                  {financialMetrics.targetAchievementRate}%
                </span>
                <span className="text-xs text-content-muted">
                  Target: {formatCurrency(user.monthlyTarget)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-surface-elevated border border-border rounded-full h-3 overflow-hidden p-0.5">
                <div
                  className="bg-brand-navy dark:bg-brand-blue h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, financialMetrics.targetAchievementRate)}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-content-secondary">
                <span>Terkumpul: {formatCurrency(financialMetrics.totalIncome)}</span>
                <span className="text-rose-500 font-medium">
                  Sisa: {formatCurrency(financialMetrics.remainingTarget)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
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
          <Card className="space-y-4">
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
              <div className="p-3 rounded-xl bg-surface-elevated border border-border/80">
                <span className="text-xs text-content-muted block">Jam Terjadwal</span>
                <span className="font-heading text-lg font-bold text-content-primary">
                  {workloadMetrics.totalHours} Jam
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border/80">
                <span className="text-xs text-content-muted block">Tugas Aktif</span>
                <span className="font-heading text-lg font-bold text-content-primary">
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
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-content-primary">
                Performa Aktivitas Ekonomi
              </h3>
              <p className="text-xs text-content-muted">
                Kontribusi laba bersih per portofolio
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePage('activities')}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Semua Aktivitas
            </Button>
          </div>

          <div className="space-y-3">
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
                  className="p-3 rounded-xl bg-surface-elevated/40 hover:bg-brand-mist/40 dark:hover:bg-brand-tint/30 border border-border transition-all cursor-pointer group"
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
                      <span className="font-heading font-bold text-xs sm:text-sm text-brand-navy dark:text-brand-blue block">
                        {formatCurrency(net)}
                      </span>
                      <span className="text-[10px] text-content-muted font-medium">
                        {contribution}% kontribusi
                      </span>
                    </div>
                  </div>

                  {/* Visual contribution bar */}
                  <div className="w-full bg-border/40 rounded-full h-1.5 mt-2.5 overflow-hidden">
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
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-content-primary">
                Transaksi Kas Terbaru
              </h3>
              <p className="text-xs text-content-muted">
                Riwayat mutasi kas masuk dan keluar
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActivePage('income-expenses')}
              rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            >
              Lihat Catatan
            </Button>
          </div>

          <div className="space-y-2.5">
            {recentCombinedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated/40 border border-border/80 text-xs hover:border-brand-soft/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-content-primary truncate">{tx.description}</p>
                    <p className="text-[11px] text-content-muted mt-0.5 truncate">
                      {tx.activityName} &bull; {tx.date}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-heading font-extrabold text-xs sm:text-sm block ${
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
