import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { IncomeTransaction, ExpenseTransaction } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { formatCurrency } from '@/lib/utils';
import { IncomeModal } from './IncomeModal';
import { PaymentUpdateModal } from './PaymentUpdateModal';
import { ExpenseModal } from './ExpenseModal';
import {
  Plus,
  Search,
  Wallet,
  Receipt,
  Edit,
  Trash2,
} from 'lucide-react';

export const FinancesModule: React.FC = () => {
  const {
    incomeTransactions,
    expenseTransactions,
    financialMetrics,
    activities,
    deleteIncome,
    deleteExpense,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('income');

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  // Modals State
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [incomeToEdit, setIncomeToEdit] = useState<IncomeTransaction | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedIncomeForPayment, setSelectedIncomeForPayment] = useState<IncomeTransaction | null>(null);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<ExpenseTransaction | null>(null);

  // Highest Expense Category Calculation
  const highestExpenseCategory = React.useMemo(() => {
    const catMap: Record<string, number> = {};
    expenseTransactions.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    let topCat = 'None';
    let topVal = 0;
    Object.entries(catMap).forEach(([cat, val]) => {
      if (val > topVal) {
        topVal = val;
        topCat = cat;
      }
    });
    return { category: topCat, amount: topVal };
  }, [expenseTransactions]);

  // Filtered Incomes
  const filteredIncomes = incomeTransactions
    .filter((inc) => {
      const matchSearch =
        inc.description.toLowerCase().includes(search.toLowerCase()) ||
        inc.paymentSource.toLowerCase().includes(search.toLowerCase()) ||
        (inc.activityName && inc.activityName.toLowerCase().includes(search.toLowerCase()));

      const matchAct = activityFilter === 'all' || inc.activityId === activityFilter;
      const matchStatus = statusFilter === 'all' || inc.paymentStatus === statusFilter;

      return matchSearch && matchAct && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return b.date.localeCompare(a.date);
      if (sortBy === 'amount') return b.invoiceAmount - a.invoiceAmount;
      return 0;
    });

  // Filtered Expenses
  const filteredExpenses = expenseTransactions
    .filter((exp) => {
      const matchSearch =
        exp.description.toLowerCase().includes(search.toLowerCase()) ||
        exp.paymentMethod.toLowerCase().includes(search.toLowerCase()) ||
        (exp.activityName && exp.activityName.toLowerCase().includes(search.toLowerCase()));

      const matchAct = activityFilter === 'all' || exp.activityId === activityFilter;
      const matchCat = categoryFilter === 'all' || exp.category === categoryFilter;

      return matchSearch && matchAct && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return b.date.localeCompare(a.date);
      if (sortBy === 'amount') return b.amount - a.amount;
      return 0;
    });

  const handleDeleteIncome = (id: string, desc: string) => {
    if (confirm(`Hapus transaksi pemasukan "${desc}"?`)) {
      deleteIncome(id);
    }
  };

  const handleDeleteExpense = (id: string, desc: string) => {
    if (confirm(`Hapus transaksi pengeluaran "${desc}"?`)) {
      deleteExpense(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Income & Expense Management"
        description="Pencatatan mutasi arus kas, pelacakan pelunasan termin invoice klien, dan pengelompokan biaya operasional."
        breadcrumb={<span>Workspace / Income &amp; Expenses</span>}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Plus className="w-4 h-4 text-emerald-500" />}
              onClick={() => {
                setIncomeToEdit(null);
                setIsIncomeModalOpen(true);
              }}
            >
              Add Income
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setExpenseToEdit(null);
                setIsExpenseModalOpen(true);
              }}
            >
              Add Expense
            </Button>
          </div>
        }
      />

      {/* OVERVIEW CARDS (Income or Expense focus) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeTab === 'income' ? (
          <>
            <Card>
              <span className="text-xs text-content-muted block">Total Received Income</span>
              <p className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {formatCurrency(financialMetrics.totalIncome)}
              </p>
              <p className="text-[11px] text-content-muted mt-1">{financialMetrics.paidCount} Transaksi Lunas</p>
            </Card>
            <Card>
              <span className="text-xs text-content-muted block">Pending Payments</span>
              <p className="font-heading text-2xl font-bold text-rose-500 mt-1">
                {formatCurrency(financialMetrics.outstandingPayments)}
              </p>
              <p className="text-[11px] text-content-muted mt-1">{financialMetrics.pendingCount} Invoice Belum Cair</p>
            </Card>
            <Card>
              <span className="text-xs text-content-muted block">Partially Paid</span>
              <p className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {financialMetrics.partiallyPaidCount} Invoice
              </p>
              <p className="text-[11px] text-content-muted mt-1">Pembayaran DP / bertahap</p>
            </Card>
            <Card>
              <span className="text-xs text-content-muted block">Total Transactions</span>
              <p className="font-heading text-2xl font-bold text-content-primary mt-1">
                {incomeTransactions.length} Rekor
              </p>
              <p className="text-[11px] text-content-muted mt-1">Riwayat tagihan klien</p>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <span className="text-xs text-content-muted block">Total Expenses</span>
              <p className="font-heading text-2xl font-bold text-rose-500 mt-1">
                {formatCurrency(financialMetrics.totalExpense)}
              </p>
              <p className="text-[11px] text-content-muted mt-1">Akumulasi pengeluaran</p>
            </Card>
            <Card>
              <span className="text-xs text-content-muted block">Monthly Expenses</span>
              <p className="font-heading text-2xl font-bold text-content-primary mt-1">
                {formatCurrency(financialMetrics.totalExpense)}
              </p>
              <p className="text-[11px] text-content-muted mt-1">Periode November 2026</p>
            </Card>
            <Card>
              <span className="text-xs text-content-muted block">Expense Transactions</span>
              <p className="font-heading text-2xl font-bold text-content-primary mt-1">
                {expenseTransactions.length} Transaksi
              </p>
              <p className="text-[11px] text-content-muted mt-1">Catatan operasional aktif</p>
            </Card>
            <Card>
              <span className="text-xs text-content-muted block">Highest Expense Category</span>
              <p className="font-heading text-lg font-bold text-brand-navy dark:text-brand-blue mt-1 truncate">
                {highestExpenseCategory.category}
              </p>
              <p className="text-[11px] text-content-muted mt-1 font-mono">
                {formatCurrency(highestExpenseCategory.amount)}
              </p>
            </Card>
          </>
        )}
      </div>

      {/* TABS SWITCH: Income vs Expense */}
      <div className="space-y-4">
        <Tabs
          variant="pills"
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab as any);
            setSearch('');
          }}
          tabs={[
            {
              id: 'income',
              label: 'Pemasukan (Income Transactions)',
              count: incomeTransactions.length,
              icon: <Wallet className="w-4 h-4 text-emerald-500" />,
            },
            {
              id: 'expense',
              label: 'Pengeluaran (Expense Transactions)',
              count: expenseTransactions.length,
              icon: <Receipt className="w-4 h-4 text-rose-500" />,
            },
          ]}
        />

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-border shadow-subtle">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              placeholder={`Cari ${activeTab === 'income' ? 'klien, deskripsi tagihan...' : 'vendor, pengeluaran...'}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Activity Filter */}
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none"
            >
              <option value="all">Semua Aktivitas</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>

            {/* Income-specific Status Filter */}
            {activeTab === 'income' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none"
              >
                <option value="all">Semua Status Bayar</option>
                <option value="Paid">Paid (Lunas)</option>
                <option value="Partially Paid">Partially Paid (DP / Sebagian)</option>
                <option value="Pending">Pending (Belum Dibayar)</option>
              </select>
            )}

            {/* Expense-specific Category Filter */}
            {activeTab === 'expense' && (
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none"
              >
                <option value="all">Semua Kategori</option>
                <option value="Transportation">Transportation</option>
                <option value="Equipment">Equipment</option>
                <option value="Subscription">Subscription</option>
                <option value="Communication">Communication</option>
                <option value="Operational">Operational</option>
                <option value="Marketing">Marketing</option>
                <option value="Other Expenses">Other Expenses</option>
              </select>
            )}

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none"
            >
              <option value="date">Urut: Tanggal Terbaru</option>
              <option value="amount">Urut: Nominal Tertinggi</option>
            </select>
          </div>
        </div>

        {/* TAB 1: INCOME TRANSACTION LIST */}
        {activeTab === 'income' && (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-brand-mist/40 dark:bg-surface-elevated/40 text-content-secondary uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Trx ID</th>
                    <th className="py-3.5 px-4 font-semibold">Description</th>
                    <th className="py-3.5 px-4 font-semibold">Activity</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Invoice Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Received Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Remaining</th>
                    <th className="py-3.5 px-4 font-semibold">Payment Status</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredIncomes.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-content-muted text-xs">
                        Tidak ada transaksi pemasukan yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredIncomes.map((inc) => (
                      <tr key={inc.id} className="hover:bg-brand-mist/20 dark:hover:bg-surface-elevated/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-content-muted text-xs">{inc.id}</td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-content-primary">{inc.description}</p>
                          <p className="text-[11px] text-content-muted">{inc.paymentSource}</p>
                        </td>
                        <td className="py-3 px-4 text-brand-blue font-medium">{inc.activityName || 'General'}</td>
                        <td className="py-3 px-4 font-mono text-content-muted">{inc.date}</td>
                        <td className="py-3 px-4 font-mono font-medium text-content-primary">
                          {formatCurrency(inc.invoiceAmount)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(inc.receivedAmount)}
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-600 dark:text-amber-400">
                          {formatCurrency(inc.remainingAmount)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={
                              inc.paymentStatus === 'Paid'
                                ? 'success'
                                : inc.paymentStatus === 'Partially Paid'
                                ? 'warning'
                                : 'danger'
                            }
                            size="sm"
                          >
                            {inc.paymentStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Payment tracking button */}
                            <button
                              onClick={() => {
                                setSelectedIncomeForPayment(inc);
                                setIsPaymentModalOpen(true);
                              }}
                              className="px-2 py-1 rounded bg-brand-mist text-brand-navy dark:bg-brand-tint dark:text-brand-blue text-[11px] font-semibold hover:opacity-80 transition-opacity"
                              title="Update Kas Diterima"
                            >
                              Update Bayar
                            </button>
                            <button
                              onClick={() => {
                                setIncomeToEdit(inc);
                                setIsIncomeModalOpen(true);
                              }}
                              className="p-1 rounded text-content-muted hover:text-content-primary"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteIncome(inc.id, inc.description)}
                              className="p-1 rounded text-content-muted hover:text-semantic-danger"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 2: EXPENSE TRANSACTION LIST */}
        {activeTab === 'expense' && (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-brand-mist/40 dark:bg-surface-elevated/40 text-content-secondary uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 font-semibold">Expense ID</th>
                    <th className="py-3.5 px-4 font-semibold">Description</th>
                    <th className="py-3.5 px-4 font-semibold">Activity</th>
                    <th className="py-3.5 px-4 font-semibold">Category</th>
                    <th className="py-3.5 px-4 font-semibold">Date</th>
                    <th className="py-3.5 px-4 font-semibold">Amount</th>
                    <th className="py-3.5 px-4 font-semibold">Method / Notes</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-content-muted text-xs">
                        Tidak ada transaksi pengeluaran yang cocok.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-brand-mist/20 dark:hover:bg-surface-elevated/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-content-muted text-xs">{exp.id}</td>
                        <td className="py-3 px-4 font-semibold text-content-primary">{exp.description}</td>
                        <td className="py-3 px-4 text-brand-blue font-medium">{exp.activityName || 'General'}</td>
                        <td className="py-3 px-4">
                          <Badge variant="neutral" size="sm">
                            {exp.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-content-muted">{exp.date}</td>
                        <td className="py-3 px-4 font-mono font-bold text-rose-500">
                          {formatCurrency(exp.amount)}
                        </td>
                        <td className="py-3 px-4 text-content-muted text-xs">
                          {exp.paymentMethod} {exp.notes && `• ${exp.notes}`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setExpenseToEdit(exp);
                                setIsExpenseModalOpen(true);
                              }}
                              className="p-1 rounded text-content-muted hover:text-content-primary"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(exp.id, exp.description)}
                              className="p-1 rounded text-content-muted hover:text-semantic-danger"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      {/* Modals */}
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        incomeToEdit={incomeToEdit}
      />

      <PaymentUpdateModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        income={selectedIncomeForPayment}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        expenseToEdit={expenseToEdit}
      />
    </div>
  );
};
