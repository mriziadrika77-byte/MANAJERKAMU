import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Search, Briefcase, ArrowDownUp, Bot, ChevronRight, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    activities,
    incomeTransactions,
    expenseTransactions,
    tasks,
    schedules,
    setActivePage,
    setSelectedActivityId,
  } = useApp();

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  const query = searchQuery.trim().toLowerCase();

  const filteredActivities = activities.filter(
    (a) =>
      a.name.toLowerCase().includes(query) ||
      a.clientOrPlatform.toLowerCase().includes(query) ||
      a.category.toLowerCase().includes(query)
  );

  const filteredIncomes = incomeTransactions.filter(
    (i) =>
      i.description.toLowerCase().includes(query) ||
      i.paymentSource.toLowerCase().includes(query) ||
      (i.activityName && i.activityName.toLowerCase().includes(query))
  );

  const filteredExpenses = expenseTransactions.filter(
    (e) =>
      e.description.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query) ||
      (e.activityName && e.activityName.toLowerCase().includes(query))
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query) ||
      (t.description && t.description.toLowerCase().includes(query)) ||
      (t.activityName && t.activityName.toLowerCase().includes(query))
  );

  const filteredSchedules = schedules.filter(
    (s) =>
      s.title.toLowerCase().includes(query) ||
      (s.activityName && s.activityName.toLowerCase().includes(query))
  );

  const handleSelectActivity = (id: string) => {
    setSelectedActivityId(id);
    setActivePage('activities');
    setIsSearchModalOpen(false);
  };

  const handleSelectFinances = () => {
    setActivePage('income-expenses');
    setIsSearchModalOpen(false);
  };

  const handleSelectWorkload = () => {
    setActivePage('schedule');
    setIsSearchModalOpen(false);
  };

  return (
    <Modal
      isOpen={isSearchModalOpen}
      onClose={() => setIsSearchModalOpen(false)}
      title="Pencarian Global Terpadu"
      description="Cari aktivitas pekerjaan, transaksi pemasukan, pengeluaran, agenda jadwal, atau tugas."
      size="lg"
    >
      <div className="space-y-4">
        {/* Search Input Field */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik kata kunci (misal: 'FinTech', 'Kopi', 'BBM', 'IELTS', 'Sprint')..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-surface text-content-primary text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-4 pt-1">
          {/* Activities Matches */}
          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-brand-blue" /> Aktivitas Pekerjaan ({filteredActivities.length})
            </h5>
            {filteredActivities.length === 0 ? (
              <p className="text-xs text-content-muted italic px-2">Tidak ada aktivitas yang cocok.</p>
            ) : (
              <div className="space-y-1">
                {filteredActivities.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleSelectActivity(act.id)}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-content-primary group-hover:text-brand-blue">
                        {act.name}
                      </p>
                      <p className="text-[11px] text-content-muted">
                        {act.clientOrPlatform} &bull; {act.category}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-content-muted group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Income Matches */}
          <div className="border-t border-border pt-3">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1.5 flex items-center gap-1.5">
              <ArrowDownUp className="w-3.5 h-3.5 text-emerald-500" /> Pemasukan (Income) ({filteredIncomes.length})
            </h5>
            {filteredIncomes.length === 0 ? (
              <p className="text-xs text-content-muted italic px-2">Tidak ada data pemasukan.</p>
            ) : (
              <div className="space-y-1">
                {filteredIncomes.map((inc) => (
                  <button
                    key={inc.id}
                    onClick={handleSelectFinances}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-content-primary group-hover:text-brand-blue">
                        {inc.description}
                      </p>
                      <p className="text-[11px] text-content-muted">
                        {inc.paymentSource} &bull; {inc.date} &bull; Status: {inc.paymentStatus}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                      +{formatCurrency(inc.receivedAmount)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Expense Matches */}
          <div className="border-t border-border pt-3">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1.5 flex items-center gap-1.5">
              <ArrowDownUp className="w-3.5 h-3.5 text-rose-500" /> Pengeluaran (Expense) ({filteredExpenses.length})
            </h5>
            {filteredExpenses.length === 0 ? (
              <p className="text-xs text-content-muted italic px-2">Tidak ada data pengeluaran.</p>
            ) : (
              <div className="space-y-1">
                {filteredExpenses.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={handleSelectFinances}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="text-xs font-semibold text-content-primary group-hover:text-brand-blue">
                        {exp.description}
                      </p>
                      <p className="text-[11px] text-content-muted">
                        {exp.category} &bull; {exp.date}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-rose-500 font-mono">
                      -{formatCurrency(exp.amount)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tasks & Schedules Matches */}
          <div className="border-t border-border pt-3">
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-content-muted mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-blue" /> Agenda &amp; Tugas ({filteredTasks.length + filteredSchedules.length})
            </h5>
            {filteredTasks.length === 0 && filteredSchedules.length === 0 ? (
              <p className="text-xs text-content-muted italic px-2">Tidak ada tugas/jadwal.</p>
            ) : (
              <div className="space-y-1">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={handleSelectWorkload}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-medium text-content-primary">
                      [Task] {t.title} ({t.priority})
                    </span>
                    <span className="text-[11px] text-content-muted">{t.deadline}</span>
                  </button>
                ))}
                {filteredSchedules.map((s) => (
                  <button
                    key={s.id}
                    onClick={handleSelectWorkload}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-medium text-content-primary">
                      [Jadwal] {s.title} ({s.startTime} - {s.endTime})
                    </span>
                    <span className="text-[11px] text-content-muted">{s.date}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Quick Nav Footnote */}
        <div className="border-t border-border pt-3 flex items-center justify-between text-xs text-content-muted">
          <span>Tekan ESC untuk menutup</span>
          <span className="flex items-center gap-1">
            <Bot className="w-3.5 h-3.5 text-brand-blue" /> One Person. Multiple Activities. One Integrated System.
          </span>
        </div>
      </div>
    </Modal>
  );
};
