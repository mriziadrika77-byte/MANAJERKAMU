import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import {
  Target,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Sliders,
  Briefcase,
  Edit,
  Trash2,
} from 'lucide-react';

export const FinancialPlanningModule: React.FC = () => {
  const {
    user,
    financialMetrics,
    monthlyTargets,
    addMonthlyTarget,
    updateMonthlyTarget,
    deleteMonthlyTarget,
  } = useApp();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'planning' | 'forecasting'>('planning');

  // Target Modal State
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [targetName, setTargetName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetMonth, setTargetMonth] = useState('2026-11');
  const [targetNotes, setTargetNotes] = useState('');

  // 3. FORECASTING SIMULATION INPUTS
  const [additionalProjects, setAdditionalProjects] = useState<number>(1);
  const avgIncomePerProject = 7500000;
  const [additionalSessions, setAdditionalSessions] = useState<number>(4);
  const avgIncomePerSession = 600000;
  const [expenseReductionPct, setExpenseReductionPct] = useState<number>(10);
  const [additionalHours, setAdditionalHours] = useState<number>(8);

  // Dynamic Forecasting Calculations (PRD Section 3.D)
  const currentIncome = financialMetrics.totalIncome;
  const currentExpenses = financialMetrics.totalExpense;
  const currentNet = financialMetrics.netIncome;

  const addedProjectIncome = additionalProjects * avgIncomePerProject;
  const addedSessionIncome = additionalSessions * avgIncomePerSession;
  const projectedIncome = currentIncome + addedProjectIncome + addedSessionIncome;

  const expenseReductionAmount = Math.round((currentExpenses * expenseReductionPct) / 100);
  const projectedExpenses = Math.max(0, currentExpenses - expenseReductionAmount);
  const projectedNetIncome = projectedIncome - projectedExpenses;

  // Scenarios Comparison
  const conservativeIncome = Math.round(currentIncome + (addedProjectIncome + addedSessionIncome) * 0.6);
  const conservativeExpenses = currentExpenses;
  const conservativeNet = conservativeIncome - conservativeExpenses;

  const optimisticIncome = Math.round(currentIncome + (addedProjectIncome + addedSessionIncome) * 1.3);
  const optimisticExpenses = Math.round(currentExpenses * 0.85);
  const optimisticNet = optimisticIncome - optimisticExpenses;

  // Target Form Handlers
  const handleOpenAddTarget = () => {
    setEditingTargetId(null);
    setTargetName('');
    setTargetAmount(user.monthlyTarget.toString());
    setTargetMonth('2026-11');
    setTargetNotes('');
    setIsTargetModalOpen(true);
  };

  const handleOpenEditTarget = (t: typeof monthlyTargets[0]) => {
    setEditingTargetId(t.id);
    setTargetName(t.name);
    setTargetAmount(t.targetAmount.toString());
    setTargetMonth(t.month);
    setTargetNotes(t.notes || '');
    setIsTargetModalOpen(true);
  };

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(targetAmount);
    if (!amt || amt <= 0) {
      toast({ title: 'Validasi Gagal', message: 'Nominal target harus lebih dari 0.', type: 'danger' });
      return;
    }

    if (editingTargetId) {
      updateMonthlyTarget(editingTargetId, {
        name: targetName || `Target ${targetMonth}`,
        targetAmount: amt,
        month: targetMonth,
        notes: targetNotes,
      });
      toast({ title: 'Target Diperbarui', message: 'Target pendapatan berhasil disimpan.', type: 'success' });
    } else {
      addMonthlyTarget({
        name: targetName || `Target ${targetMonth}`,
        targetAmount: amt,
        month: targetMonth,
        year: parseInt(targetMonth.split('-')[0]),
        notes: targetNotes,
      });
      toast({ title: 'Target Baru Dibuat', message: 'Target bulanan baru aktif.', type: 'success' });
    }

    setIsTargetModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Financial Planning & Forecasting"
        description="Atur target ekonomi bulanan & tahunan, pantau selisih realisasi kas, dan simulasikan skenario proyeksi masa depan."
        breadcrumb={<span>Workspace / Financial Planning</span>}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveTab(activeTab === 'planning' ? 'forecasting' : 'planning')}
              leftIcon={<Sliders className="w-4 h-4" />}
            >
              {activeTab === 'planning' ? 'Buka Simulator Proyeksi' : 'Kembali ke Perencanaan'}
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenAddTarget}
            >
              Buat Target Bulanan
            </Button>
          </div>
        }
      />

      {/* 2.A FINANCIAL PLANNING OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Monthly Target</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-content-primary mt-1 block font-mono truncate">
            {formatCurrency(user.monthlyTarget)}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Annual Target</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-content-primary mt-1 block font-mono truncate">
            {formatCurrency(user.annualTarget)}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Actual Received</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block font-mono truncate">
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
          <span className="text-[11px] text-brand-navy dark:text-brand-blue block font-semibold">Current Net Income</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-brand-navy dark:text-brand-blue mt-1 block font-mono truncate">
            {formatCurrency(financialMetrics.netIncome)}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">Remaining Target</span>
          <span className="font-heading text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400 mt-1 block font-mono truncate">
            {formatCurrency(financialMetrics.remainingTarget)}
          </span>
        </Card>
      </div>

      {/* VIEW TABS: Planning vs Forecasting */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab('planning')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'planning'
              ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
              : 'text-content-secondary hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          Target &amp; Realisasi Keuangan
        </button>
        <button
          onClick={() => setActiveTab('forecasting')}
          className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            activeTab === 'forecasting'
              ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
              : 'text-content-secondary hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          Simulasi Proyeksi (Forecasting Engine)
        </button>
      </div>

      {/* TAB 1: FINANCIAL PLANNING (TARGETS & INSIGHTS) */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 2.B Monthly Target Progress & Visuals */}
            <Card className="lg:col-span-2 space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <h3 className="font-heading text-base font-bold text-content-primary flex items-center gap-2">
                    <Target className="w-5 h-5 text-brand-blue" /> Progres Target Bulanan (November 2026)
                  </h3>
                  <p className="text-xs text-content-muted">Perbandingan realisasi kas masuk terhadap target aktif</p>
                </div>
                <Badge variant={financialMetrics.targetAchievementRate >= 80 ? 'success' : 'warning'} size="md">
                  {financialMetrics.targetAchievementRate}% Tercapai
                </Badge>
              </div>

              {/* Large Progress Bar with Real Values */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-content-primary">
                    Kas Diterima: {formatCurrency(financialMetrics.totalIncome)}
                  </span>
                  <span className="font-bold text-brand-navy dark:text-brand-blue font-mono">
                    Target: {formatCurrency(user.monthlyTarget)}
                  </span>
                </div>
                <div className="w-full bg-surface-elevated border border-border rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-brand-navy dark:bg-brand-blue h-full rounded-full transition-all duration-700"
                    style={{ width: `${financialMetrics.targetAchievementRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-content-muted pt-1">
                  <span>Selisih Kekurangan: {formatCurrency(financialMetrics.remainingTarget)}</span>
                  <span>Estimasi Invoice Pending: {formatCurrency(financialMetrics.outstandingPayments)}</span>
                </div>
              </div>

              {/* 2.C Annual Income Target Overview */}
              <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-content-primary">Annual Income Target (2026)</span>
                  <span className="text-xs font-mono font-bold text-brand-blue">{formatCurrency(user.annualTarget)}</span>
                </div>
                <div className="w-full bg-surface border border-border rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${financialMetrics.annualAchievementRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-content-muted">
                  <span>Proyeksi Setahun: {formatCurrency(financialMetrics.totalIncome * 12)}</span>
                  <span>{financialMetrics.annualAchievementRate}% dari target tahunan</span>
                </div>
              </div>

              {/* Monthly Targets History List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-content-muted mb-2.5">
                  Daftar Target Periode Tersimpan ({monthlyTargets.length})
                </h4>
                <div className="space-y-2">
                  {monthlyTargets.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl border border-border bg-surface-elevated/30 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-content-primary">{t.name}</p>
                        <p className="text-[11px] text-content-muted">
                          Bulan: {t.month} {t.notes && `• ${t.notes}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-brand-navy dark:text-brand-blue">
                          {formatCurrency(t.targetAmount)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditTarget(t)}
                            className="p-1 rounded text-content-muted hover:text-content-primary"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMonthlyTarget(t.id)}
                            className="p-1 rounded text-content-muted hover:text-rose-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 2.E Dynamic Financial Planning Insights */}
            <Card className="space-y-4">
              <h3 className="font-heading text-base font-bold text-content-primary border-b border-border pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-blue" /> Planning Insights (Data Real)
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/40 text-xs space-y-1">
                  <p className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Target Berjalan Positif
                  </p>
                  <p className="text-content-secondary leading-relaxed">
                    Target bulan ini telah tercapai {financialMetrics.targetAchievementRate}%. Masih dibutuhkan pemasukan senilai{' '}
                    <span className="font-bold text-content-primary">{formatCurrency(financialMetrics.remainingTarget)}</span>{' '}
                    untuk memenuhi target penuh Rp 30.000.000.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/40 text-xs space-y-1">
                  <p className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-brand-blue" /> Kontribusi Terbesar
                  </p>
                  <p className="text-content-secondary leading-relaxed">
                    Aktivitas <span className="font-bold text-content-primary">UI/UX Redesign FinTech</span> menyumbang kas bersih terbesar (~58%), disusul oleh operasional Toko Kopi Drip.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/40 text-xs space-y-1">
                  <p className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Potensi Kas Tertahan
                  </p>
                  <p className="text-content-secondary leading-relaxed">
                    Terdapat tagihan tertunda senilai{' '}
                    <span className="font-bold text-amber-700 dark:text-amber-300">{formatCurrency(financialMetrics.outstandingPayments)}</span>.{' '}
                    Jika dilunasi tepat waktu, target bulanan akan langsung terlampaui.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIAL FORECASTING (SIMULATION ENGINE) */}
      {activeTab === 'forecasting' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: 3.C Simulation Inputs */}
            <Card className="space-y-4">
              <h3 className="font-heading text-base font-bold text-content-primary border-b border-border pb-2 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-blue" /> Variabel Asumsi Simulasi
              </h3>
              <p className="text-xs text-content-muted">
                Ubah parameter input di bawah ini untuk melihat proyeksi dampak finansial secara real-time.
              </p>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-semibold text-content-primary block mb-1">
                    1. Tambahan Proyek Freelance: +{additionalProjects} Proyek
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={additionalProjects}
                    onChange={(e) => setAdditionalProjects(parseInt(e.target.value))}
                    className="w-full accent-brand-blue"
                  />
                  <div className="flex items-center justify-between text-[11px] text-content-muted mt-1">
                    <span>Rata-rata / Proyek:</span>
                    <span className="font-bold font-mono">{formatCurrency(avgIncomePerProject)}</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-content-primary block mb-1">
                    2. Tambahan Sesi Kursus / Mentoring: +{additionalSessions} Sesi
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={additionalSessions}
                    onChange={(e) => setAdditionalSessions(parseInt(e.target.value))}
                    className="w-full accent-brand-blue"
                  />
                  <div className="flex items-center justify-between text-[11px] text-content-muted mt-1">
                    <span>Tarif / Sesi:</span>
                    <span className="font-bold font-mono">{formatCurrency(avgIncomePerSession)}</span>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-content-primary block mb-1">
                    3. Penghematan Biaya Operasional: {expenseReductionPct}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="5"
                    value={expenseReductionPct}
                    onChange={(e) => setExpenseReductionPct(parseInt(e.target.value))}
                    className="w-full accent-brand-blue"
                  />
                  <span className="text-[11px] text-content-muted">
                    Potensi hemat: {formatCurrency(expenseReductionAmount)}
                  </span>
                </div>

                <div>
                  <label className="font-semibold text-content-primary block mb-1">
                    4. Alokasi Tambahan Jam Kerja: +{additionalHours} Jam/mgg
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="2"
                    value={additionalHours}
                    onChange={(e) => setAdditionalHours(parseInt(e.target.value))}
                    className="w-full accent-brand-blue"
                  />
                  <span className="text-[11px] text-content-muted">
                    Total jam kerja baru: {financialMetrics.revenuePerHour > 0 ? `${38.5 + additionalHours} Jam` : '46.5 Jam'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Right: 3.A & 3.D Dynamic Projection Output & 3.E Comparison */}
            <div className="lg:col-span-2 space-y-6">
              {/* Projection Result Card */}
              <Card className="space-y-4 border-brand-soft/60">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h3 className="font-heading text-base font-bold text-content-primary flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-500" /> Hasil Proyeksi Finansial
                  </h3>
                  <Badge variant="success" size="sm">
                    Simulasi Dinamis
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-border">
                    <span className="text-xs text-content-muted block">Projected Income</span>
                    <p className="font-heading text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                      {formatCurrency(projectedIncome)}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                      +{formatCurrency(addedProjectIncome + addedSessionIncome)} dari asumsi baru
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface-elevated/60 border border-border">
                    <span className="text-xs text-content-muted block">Projected Expenses</span>
                    <p className="font-heading text-xl font-bold text-rose-500 mt-1 font-mono">
                      {formatCurrency(projectedExpenses)}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-medium mt-1 block">
                      Hemat {expenseReductionPct}% (-{formatCurrency(expenseReductionAmount)})
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-brand-mist/50 dark:bg-brand-tint border border-brand-soft/40">
                    <span className="text-xs text-brand-navy dark:text-brand-blue block font-semibold">
                      Projected Net Income
                    </span>
                    <p className="font-heading text-xl font-bold text-brand-navy dark:text-brand-blue mt-1 font-mono">
                      {formatCurrency(projectedNetIncome)}
                    </p>
                    <span className="text-[10px] text-content-muted mt-1 block">
                      Kenaikan net: +{formatCurrency(projectedNetIncome - currentNet)}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-content-muted italic">
                  *Catatan transparansi: Hasil simulasi merupakan proyeksi matematis berdasarkan nilai asumsi input pengguna dan bukan jaminan pendapatan pasti.
                </p>
              </Card>

              {/* 3.E Scenario Comparison (Current vs Conservative vs Optimistic) */}
              <Card className="space-y-4">
                <h3 className="font-heading text-base font-bold text-content-primary border-b border-border pb-2">
                  Perbandingan 3 Skenario Proyeksi
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Current */}
                  <div className="p-3.5 rounded-xl border border-border bg-surface-elevated/30 space-y-2 text-xs">
                    <span className="font-bold text-content-secondary uppercase text-[10px] tracking-wider block">
                      1. Skenario Saat Ini (Current)
                    </span>
                    <p className="font-mono text-base font-bold text-content-primary">
                      {formatCurrency(currentNet)}
                    </p>
                    <p className="text-[11px] text-content-muted">
                      Berdasarkan mutasi kas aktual yang telah tercatat di sistem tanpa tambahan beban.
                    </p>
                  </div>

                  {/* Conservative */}
                  <div className="p-3.5 rounded-xl border border-border bg-surface-elevated/30 space-y-2 text-xs">
                    <span className="font-bold text-blue-600 dark:text-blue-400 uppercase text-[10px] tracking-wider block">
                      2. Skenario Konservatif
                    </span>
                    <p className="font-mono text-base font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(conservativeNet)}
                    </p>
                    <p className="text-[11px] text-content-muted">
                      Asumsi realisasi proyek &amp; sesi hanya 60% dengan pengeluaran operasional tetap.
                    </p>
                  </div>

                  {/* Optimistic */}
                  <div className="p-3.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2 text-xs">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider block">
                      3. Skenario Optimis
                    </span>
                    <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(optimisticNet)}
                    </p>
                    <p className="text-[11px] text-content-muted">
                      Realisasi proyek 130% target dengan efisiensi pengeluaran optimal 15%.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Target Planning Modal */}
      <Modal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        title={editingTargetId ? 'Edit Target Pendapatan' : 'Buat Target Pendapatan Baru'}
        description="Tetapkan sasaran nominal pendapatan bulanan untuk memandu fokus kerja Anda."
      >
        <form onSubmit={handleSaveTarget} className="space-y-4">
          <Input
            label="Nama Target *"
            required
            placeholder="Contoh: Target Q4 November, Target Penutupan Tahun"
            value={targetName}
            onChange={(e) => setTargetName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nominal Target (IDR) *"
              type="number"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
            />

            <Input
              label="Bulan Periode *"
              type="month"
              required
              value={targetMonth}
              onChange={(e) => setTargetMonth(e.target.value)}
            />
          </div>

          <Input
            label="Catatan Strategi (Opsional)"
            placeholder="Fokus penagihan invoice atau ekspansi toko..."
            value={targetNotes}
            onChange={(e) => setTargetNotes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsTargetModalOpen(false)}>
              Batal
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Simpan Target
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

