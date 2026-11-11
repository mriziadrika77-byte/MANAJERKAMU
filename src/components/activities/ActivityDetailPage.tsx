import React from 'react';
import { useApp } from '@/context/AppContext';
import { Activity } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Wallet,
  Clock,
  Briefcase,
  ListTodo,
} from 'lucide-react';

interface ActivityDetailPageProps {
  activity: Activity;
  onBack: () => void;
  onEdit: (activity: Activity) => void;
}

export const ActivityDetailPage: React.FC<ActivityDetailPageProps> = ({
  activity,
  onBack,
  onEdit,
}) => {
  const {
    incomeTransactions,
    expenseTransactions,
    tasks,
    schedules,
    deleteActivity,
    setActivePage,
  } = useApp();

  // Related Entities Filtered
  const relatedIncomes = incomeTransactions.filter((i) => i.activityId === activity.id);
  const relatedExpenses = expenseTransactions.filter((e) => e.activityId === activity.id);
  const relatedTasks = tasks.filter((t) => t.activityId === activity.id);
  const relatedSchedules = schedules.filter((s) => s.activityId === activity.id);

  const totalReceived = relatedIncomes.reduce((sum, i) => sum + i.receivedAmount, 0);
  const totalInvoiced = relatedIncomes.reduce((sum, i) => sum + i.invoiceAmount, 0);
  const totalSpent = relatedExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netEarnings = totalReceived - totalSpent;
  const targetAchieved = activity.expectedIncome > 0
    ? Math.min(100, Math.round((totalReceived / activity.expectedIncome) * 100))
    : 0;

  const handleDelete = () => {
    if (confirm(`Apakah Anda yakin ingin menghapus aktivitas "${activity.name}"?`)) {
      deleteActivity(activity.id);
      onBack();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Header with Back button and Actions */}
      <PageHeader
        title={activity.name}
        description={`${activity.category} • Klien: ${activity.clientOrPlatform} • Dimulai ${activity.startDate}`}
        breadcrumb={
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-brand-blue transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke My Activities
          </button>
        }
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit className="w-4 h-4" />}
              onClick={() => onEdit(activity)}
            >
              Edit Aktivitas
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleDelete}
            >
              Hapus
            </Button>
          </div>
        }
      />

      {/* 4 Financial Cards for this Activity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <span className="text-xs text-content-muted block">Total Received Income</span>
          <p className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {formatCurrency(totalReceived)}
          </p>
          <p className="text-[11px] text-content-muted mt-1">
            Dari total tagihan {formatCurrency(totalInvoiced)}
          </p>
        </Card>

        <Card>
          <span className="text-xs text-content-muted block">Total Expenses</span>
          <p className="font-heading text-2xl font-bold text-rose-500 mt-1">
            {formatCurrency(totalSpent)}
          </p>
          <p className="text-[11px] text-content-muted mt-1">
            Biaya operasional &amp; modal kerja
          </p>
        </Card>

        <Card>
          <span className="text-xs text-brand-navy dark:text-brand-blue block font-semibold">
            Net Income (Laba Bersih)
          </span>
          <p className="font-heading text-2xl font-bold text-brand-navy dark:text-brand-blue mt-1">
            {formatCurrency(netEarnings)}
          </p>
          <p className="text-[11px] text-content-muted mt-1">
            Margin: {totalReceived > 0 ? Math.round((netEarnings / totalReceived) * 100) : 0}%
          </p>
        </Card>

        <Card>
          <span className="text-xs text-content-muted block">Target Achievement</span>
          <p className="font-heading text-2xl font-bold text-content-primary mt-1">
            {targetAchieved}%
          </p>
          <div className="w-full bg-surface-elevated border border-border rounded-full h-2 mt-2 overflow-hidden">
            <div className="bg-brand-blue h-full rounded-full" style={{ width: `${targetAchieved}%` }} />
          </div>
        </Card>
      </div>

      {/* Activity Details & Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Info & Performance */}
        <Card className="lg:col-span-1 space-y-4">
          <h3 className="font-heading text-base font-bold text-content-primary border-b border-border pb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-brand-blue" /> Info Aktivitas
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <span className="text-content-muted block text-xs">Status:</span>
              <Badge
                variant={
                  activity.status === 'Active'
                    ? 'success'
                    : activity.status === 'Completed'
                    ? 'info'
                    : 'warning'
                }
                size="sm"
                className="mt-1"
              >
                {activity.status}
              </Badge>
            </div>

            <div>
              <span className="text-content-muted block text-xs">Model Pembayaran:</span>
              <p className="font-semibold text-content-primary mt-0.5">{activity.paymentModel}</p>
            </div>

            <div>
              <span className="text-content-muted block text-xs">Target Pendapatan (Expected):</span>
              <p className="font-mono font-bold text-content-primary mt-0.5">
                {formatCurrency(activity.expectedIncome)}
              </p>
            </div>

            <div>
              <span className="text-content-muted block text-xs">Estimasi Biaya Operasional:</span>
              <p className="font-mono font-medium text-rose-500 mt-0.5">
                {formatCurrency(activity.operationalCost)}
              </p>
            </div>

            <div>
              <span className="text-content-muted block text-xs">Jam Kerja Terakumulasi:</span>
              <p className="font-semibold text-content-primary mt-0.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-blue" /> {activity.hoursWorked} Jam
              </p>
            </div>

            {activity.description && (
              <div>
                <span className="text-content-muted block text-xs">Deskripsi:</span>
                <p className="text-xs text-content-secondary mt-1 bg-surface-elevated/50 p-2.5 rounded-lg border border-border">
                  {activity.description}
                </p>
              </div>
            )}

            {activity.notes && (
              <div>
                <span className="text-content-muted block text-xs">Catatan Khusus:</span>
                <p className="text-xs text-content-secondary mt-1 italic">{activity.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Right: Related Transactions, Tasks & Schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Related Incomes & Expenses */}
          <Card>
            <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
              <h3 className="font-heading text-base font-bold text-content-primary flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-500" /> Transaksi Terkait ({relatedIncomes.length + relatedExpenses.length})
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActivePage('income-expenses')}
                className="text-xs text-brand-blue"
              >
                Buka Income &amp; Expenses
              </Button>
            </div>

            {relatedIncomes.length === 0 && relatedExpenses.length === 0 ? (
              <p className="text-xs text-content-muted py-4 text-center italic">
                Belum ada transaksi yang terhubung dengan aktivitas ini.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {relatedIncomes.map((inc) => (
                  <div
                    key={inc.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated/40 border border-border text-xs"
                  >
                    <div>
                      <p className="font-semibold text-content-primary">{inc.description}</p>
                      <p className="text-[11px] text-content-muted">{inc.date} • {inc.paymentSource}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                        +{formatCurrency(inc.receivedAmount)}
                      </span>
                      <Badge variant={inc.paymentStatus === 'Paid' ? 'success' : 'warning'} size="sm">
                        {inc.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
                {relatedExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-surface-elevated/40 border border-border text-xs"
                  >
                    <div>
                      <p className="font-semibold text-content-primary">{exp.description}</p>
                      <p className="text-[11px] text-content-muted">{exp.date} • Kategori: {exp.category}</p>
                    </div>
                    <span className="font-mono font-bold text-rose-500">
                      -{formatCurrency(exp.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Related Tasks & Schedules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <h4 className="font-heading text-sm font-bold text-content-primary mb-2 flex items-center gap-1.5 border-b border-border pb-2">
                <ListTodo className="w-4 h-4 text-brand-blue" /> Tugas Terkait ({relatedTasks.length})
              </h4>
              {relatedTasks.length === 0 ? (
                <p className="text-xs text-content-muted py-4 text-center italic">Tidak ada tugas aktif.</p>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {relatedTasks.map((t) => (
                    <div key={t.id} className="p-2 rounded-lg bg-surface-elevated/40 border border-border text-xs flex items-center justify-between">
                      <span className={t.status === 'Completed' ? 'line-through text-content-muted' : 'font-medium text-content-primary'}>
                        {t.title}
                      </span>
                      <Badge variant={t.priority === 'Urgent' ? 'danger' : t.priority === 'High' ? 'warning' : 'neutral'} size="sm">
                        {t.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <h4 className="font-heading text-sm font-bold text-content-primary mb-2 flex items-center gap-1.5 border-b border-border pb-2">
                <Calendar className="w-4 h-4 text-brand-blue" /> Jadwal Terkait ({relatedSchedules.length})
              </h4>
              {relatedSchedules.length === 0 ? (
                <p className="text-xs text-content-muted py-4 text-center italic">Tidak ada jadwal agenda.</p>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {relatedSchedules.map((s) => (
                    <div key={s.id} className="p-2 rounded-lg bg-surface-elevated/40 border border-border text-xs">
                      <p className="font-medium text-content-primary">{s.title}</p>
                      <p className="text-[11px] text-content-muted mt-0.5">{s.date} • {s.startTime} - {s.endTime}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

