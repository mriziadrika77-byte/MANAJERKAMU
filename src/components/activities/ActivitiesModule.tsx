import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Activity } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { ActivityModal } from './ActivityModal';
import { ActivityDetailPage } from './ActivityDetailPage';
import {
  Plus,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ChevronRight,
  Edit,
  Trash2,
  Clock,
} from 'lucide-react';

export const ActivitiesModule: React.FC = () => {
  const {
    activities,
    activityMetrics,
    deleteActivity,
    selectedActivityId,
    setSelectedActivityId,
  } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'expectedIncome' | 'netIncome' | 'startDate'>('name');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState<Activity | null>(null);

  // If detail view is open
  const selectedActivity = activities.find((a) => a.id === selectedActivityId);

  if (selectedActivity) {
    return (
      <ActivityDetailPage
        activity={selectedActivity}
        onBack={() => setSelectedActivityId(null)}
        onEdit={(act) => {
          setActivityToEdit(act);
          setIsModalOpen(true);
        }}
      />
    );
  }

  // Filter & Sort Logic
  const filteredActivities = activities
    .filter((act) => {
      const matchSearch =
        act.name.toLowerCase().includes(search.toLowerCase()) ||
        act.clientOrPlatform.toLowerCase().includes(search.toLowerCase()) ||
        (act.description && act.description.toLowerCase().includes(search.toLowerCase()));

      const matchCategory = categoryFilter === 'all' || act.category === categoryFilter;
      const matchStatus = statusFilter === 'all' || act.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'expectedIncome') return b.expectedIncome - a.expectedIncome;
      if (sortBy === 'netIncome') {
        const netA = a.actualIncome - a.actualExpense;
        const netB = b.actualIncome - b.actualExpense;
        return netB - netA;
      }
      if (sortBy === 'startDate') return b.startDate.localeCompare(a.startDate);
      return 0;
    });

  const handleOpenAdd = () => {
    setActivityToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (act: Activity, e: React.MouseEvent) => {
    e.stopPropagation();
    setActivityToEdit(act);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Hapus aktivitas "${name}"? Seluruh mutasi terkait akan dipertahankan sebagai general.`)) {
      deleteActivity(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <PageHeader
        title="My Activities Portfolio"
        description="Pusat pengelolaan terpadu seluruh aktivitas ekonomi, pekerjaan freelance, platform gig, dan bisnis Anda."
        breadcrumb={<span>Workspace / My Activities</span>}
        action={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenAdd}
          >
            Tambah Aktivitas Baru
          </Button>
        }
      />

      {/* 3.A ACTIVITY OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Total Activities</span>
          <span className="font-heading text-2xl font-bold text-content-primary mt-1 block">
            {activityMetrics.total}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Active</span>
          <span className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {activityMetrics.active}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-medium">Completed</span>
          <span className="font-heading text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 block">
            {activityMetrics.completed}
          </span>
        </Card>
        <Card className="p-4">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">Paused</span>
          <span className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {activityMetrics.paused}
          </span>
        </Card>
        <Card className="p-4 sm:col-span-1">
          <span className="text-[11px] text-content-muted block">Expected Income</span>
          <span className="font-mono text-sm sm:text-base font-bold text-content-primary mt-1 block truncate">
            {formatCurrency(activityMetrics.totalExpectedIncome)}
          </span>
        </Card>
        <Card className="p-4 sm:col-span-1">
          <span className="text-[11px] text-brand-navy dark:text-brand-blue block font-semibold">Total Net Income</span>
          <span className="font-mono text-sm sm:text-base font-bold text-brand-navy dark:text-brand-blue mt-1 block truncate">
            {formatCurrency(activityMetrics.totalNetIncome)}
          </span>
        </Card>
      </div>

      {/* SEARCH, FILTER, SORT & VIEW SWITCH */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-border shadow-subtle">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            placeholder="Cari aktivitas, klien, atau platform..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="all">Semua Kategori</option>
            <option value="Project-based">Project-based</option>
            <option value="Platform-based">Platform-based</option>
            <option value="Session-based">Session-based</option>
            <option value="Business-based">Business-based</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="all">Semua Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs py-2 px-2.5 rounded-lg border border-border bg-surface text-content-primary focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <option value="name">Urut: Nama (A-Z)</option>
            <option value="netIncome">Urut: Net Tertinggi</option>
            <option value="expectedIncome">Urut: Target Tertinggi</option>
            <option value="startDate">Urut: Tanggal Mulai</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-border rounded-lg p-0.5 bg-surface-elevated">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'cards'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                  : 'text-content-muted hover:text-content-primary'
              }`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                  : 'text-content-muted hover:text-content-primary'
              }`}
              title="Tampilan Tabel"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3.B ACTIVITY LIST - CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredActivities.length === 0 ? (
            <div className="col-span-full py-12 text-center text-content-muted">
              Tidak ada aktivitas yang sesuai dengan filter pencarian.
            </div>
          ) : (
            filteredActivities.map((act) => {
              const net = act.actualIncome - act.actualExpense;
              const margin = act.actualIncome > 0 ? Math.round((net / act.actualIncome) * 100) : 0;
              const achievement = act.expectedIncome > 0
                ? Math.min(100, Math.round((act.actualIncome / act.expectedIncome) * 100))
                : 0;

              return (
                <Card
                  key={act.id}
                  hoverable
                  onClick={() => setSelectedActivityId(act.id)}
                  className="relative group transition-all duration-200 border-border hover:border-brand-soft flex flex-col justify-between"
                >
                  <div>
                    {/* Top row: Badge and Actions */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="default" size="sm">
                          {act.category}
                        </Badge>
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

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={(e) => handleOpenEdit(act, e)}
                          className="p-1 rounded text-content-muted hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(act.id, act.name, e)}
                          className="p-1 rounded text-content-muted hover:text-semantic-danger hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Title & Client */}
                    <h3 className="font-heading text-lg font-bold text-content-primary group-hover:text-brand-blue transition-colors">
                      {act.name}
                    </h3>
                    <p className="text-xs text-content-muted mt-0.5">
                      {act.clientOrPlatform} &bull; Model: {act.paymentModel} &bull; Mulai {act.startDate}
                    </p>

                    {act.description && (
                      <p className="text-xs text-content-secondary mt-2 line-clamp-2">
                        {act.description}
                      </p>
                    )}

                    {/* Financial Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 mt-4 p-3 rounded-xl bg-surface-elevated/50 border border-border">
                      <div>
                        <span className="text-[10px] text-content-muted block">Expected</span>
                        <span className="font-mono text-xs font-semibold text-content-primary">
                          {formatCurrency(act.expectedIncome)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-content-muted block">Received</span>
                        <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(act.actualIncome)}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-content-muted block">Net Income</span>
                        <span className="font-mono text-xs font-bold text-brand-navy dark:text-brand-blue">
                          {formatCurrency(net)}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-content-muted">
                        <span>Pencapaian Target ({achievement}%)</span>
                        <span>Margin Laba: {margin}%</span>
                      </div>
                      <div className="w-full bg-surface-elevated border border-border rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-navy dark:bg-brand-blue h-full rounded-full transition-all duration-300"
                          style={{ width: `${achievement}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-brand-blue font-medium">
                    <span className="flex items-center gap-1 text-content-muted">
                      <Clock className="w-3.5 h-3.5" /> {act.hoursWorked} Jam Kerja
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Buka Detail <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* 3.B ACTIVITY LIST - TABLE VIEW */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-brand-mist/40 dark:bg-surface-elevated/40 text-content-secondary uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">Activity Name</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Client / Platform</th>
                  <th className="py-3.5 px-4 font-semibold">Expected</th>
                  <th className="py-3.5 px-4 font-semibold">Received</th>
                  <th className="py-3.5 px-4 font-semibold">Expense</th>
                  <th className="py-3.5 px-4 font-semibold">Net</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredActivities.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-content-muted text-xs">
                      Tidak ada aktivitas yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredActivities.map((act) => {
                    const net = act.actualIncome - act.actualExpense;
                    return (
                      <tr
                        key={act.id}
                        onClick={() => setSelectedActivityId(act.id)}
                        className="hover:bg-brand-mist/20 dark:hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                      >
                        <td className="py-3 px-4 font-semibold text-content-primary">
                          {act.name}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="default" size="sm">{act.category}</Badge>
                        </td>
                        <td className="py-3 px-4 text-content-secondary">{act.clientOrPlatform}</td>
                        <td className="py-3 px-4 font-mono">{formatCurrency(act.expectedIncome)}</td>
                        <td className="py-3 px-4 font-mono text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(act.actualIncome)}
                        </td>
                        <td className="py-3 px-4 font-mono text-rose-500">
                          {formatCurrency(act.actualExpense)}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-brand-navy dark:text-brand-blue">
                          {formatCurrency(net)}
                        </td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => handleOpenEdit(act, e)}
                              className="p-1 rounded text-content-muted hover:text-content-primary transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => handleDelete(act.id, act.name, e)}
                              className="p-1 rounded text-content-muted hover:text-semantic-danger transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add / Edit Activity Modal */}
      <ActivityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activityToEdit={activityToEdit}
      />
    </div>
  );
};

