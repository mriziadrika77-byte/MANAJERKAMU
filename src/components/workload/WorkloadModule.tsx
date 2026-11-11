import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { WorkSchedule, TaskItem } from '@/types';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ScheduleModal } from './ScheduleModal';
import { TaskModal } from './TaskModal';
import {
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  ListTodo,
  CheckSquare,
  Square,
  Edit,
  Trash2,
} from 'lucide-react';

export const WorkloadModule: React.FC = () => {
  const {
    schedules,
    tasks,
    activities,
    workloadMetrics,
    toggleTaskStatus,
    deleteTask,
    deleteSchedule,
  } = useApp();

  const [calendarView, setCalendarView] = useState<'monthly' | 'weekly' | 'daily'>('weekly');

  // Filter states
  const [activityFilter, setActivityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<WorkSchedule | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

  // Filtered schedules
  const filteredSchedules = schedules.filter((s) => {
    const matchAct = activityFilter === 'all' || s.activityId === activityFilter;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchAct && matchStatus;
  });

  // Filtered tasks
  const filteredTasks = tasks.filter((t) => {
    const matchAct = activityFilter === 'all' || t.activityId === activityFilter;
    return matchAct;
  });

  // Workload Distribution Calculations
  const hoursByActivity = React.useMemo(() => {
    const map: Record<string, number> = {};
    schedules.forEach((s) => {
      const name = s.activityName || 'General';
      map[name] = (map[name] || 0) + s.durationHours;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [schedules]);

  const topWorkloadActivity = hoursByActivity[0] || ['Tidak ada', 0];

  const handleDeleteSchedule = (id: string, title: string) => {
    if (confirm(`Hapus jadwal "${title}"?`)) {
      deleteSchedule(id);
    }
  };

  const handleDeleteTask = (id: string, title: string) => {
    if (confirm(`Hapus tugas "${title}"?`)) {
      deleteTask(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Workload & Schedule Management"
        description="Pengelolaan alokasi waktu kerja terpadu lintas aktivitas, kalender fleksibel, dan deteksi benturan jadwal."
        breadcrumb={<span>Workspace / Workload &amp; Schedule</span>}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Plus className="w-4 h-4 text-brand-blue" />}
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
            >
              Add Task
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setScheduleToEdit(null);
                setIsScheduleModalOpen(true);
              }}
            >
              Add Schedule
            </Button>
          </div>
        }
      />

      {/* 6.A SCHEDULE OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-4">
          <span className="text-[11px] text-content-muted block">Total Working Hours</span>
          <span className="font-heading text-2xl font-bold text-content-primary mt-1 block">
            {workloadMetrics.totalHours} Jam
          </span>
          <span className="text-[10px] text-content-muted mt-0.5 block">
            Batas Sehat: {workloadMetrics.maxCapacityHours} Jam/mgg
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-brand-blue block font-medium">Active Tasks</span>
          <span className="font-heading text-2xl font-bold text-brand-blue mt-1 block">
            {workloadMetrics.activeTasks}
          </span>
          <span className="text-[10px] text-content-muted mt-0.5 block">Sedang berjalan</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">Upcoming Deadlines</span>
          <span className="font-heading text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 block">
            {workloadMetrics.upcomingDeadlines}
          </span>
          <span className="text-[10px] text-content-muted mt-0.5 block">Tenggat terdekat</span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Completed Tasks</span>
          <span className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
            {workloadMetrics.completedTasks}
          </span>
          <span className="text-[10px] text-content-muted mt-0.5 block">Tugas terselesaikan</span>
        </Card>

        <Card className="p-4 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-rose-500 block font-medium">Schedule Conflicts</span>
          <span className="font-heading text-2xl font-bold text-rose-500 mt-1 block">
            {workloadMetrics.scheduleConflicts}
          </span>
          <span className="text-[10px] text-rose-400 mt-0.5 block">Benturan waktu</span>
        </Card>
      </div>

      {/* 6.B & 6.C CALENDAR VIEW & SCHEDULE MANAGEMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Schedules (2 cols) */}
        <Card className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-brand-blue" />
              <h3 className="font-heading text-base font-bold text-content-primary">
                Agenda Kalender Kerja
              </h3>
              <span className="text-xs text-content-muted font-medium ml-1">
                (November 2026)
              </span>
            </div>

            {/* View Switchers: Monthly / Weekly / Daily */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <div className="flex border border-border rounded-lg p-0.5 bg-surface-elevated text-xs font-medium">
                <button
                  onClick={() => setCalendarView('monthly')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    calendarView === 'monthly'
                      ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                      : 'text-content-muted hover:text-content-primary'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setCalendarView('weekly')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    calendarView === 'weekly'
                      ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                      : 'text-content-muted hover:text-content-primary'
                  }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setCalendarView('daily')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    calendarView === 'daily'
                      ? 'bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg'
                      : 'text-content-muted hover:text-content-primary'
                  }`}
                >
                  Daily
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Navigation Strip */}
          <div className="flex items-center justify-between bg-surface-elevated/40 p-2.5 rounded-xl border border-border">
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronLeft className="w-4 h-4 text-content-muted" />
              </button>
              <span className="text-xs sm:text-sm font-semibold text-content-primary">
                {calendarView === 'weekly'
                  ? 'Minggu 2 (09 - 15 November 2026)'
                  : calendarView === 'monthly'
                  ? 'Bulan November 2026'
                  : 'Kamis, 12 November 2026'}
              </span>
              <button className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <ChevronRight className="w-4 h-4 text-content-muted" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="py-1 px-2 rounded-lg border border-border bg-surface text-content-primary text-xs"
              >
                <option value="all">Semua Aktivitas</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1 px-2 rounded-lg border border-border bg-surface text-content-primary text-xs"
              >
                <option value="all">Semua Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* 6.D SCHEDULE LIST & CONFLICT DETECTION */}
          <div className="space-y-3 pt-2">
            {filteredSchedules.length === 0 ? (
              <p className="text-xs text-content-muted py-8 text-center italic">
                Tidak ada agenda jadwal yang ditemukan pada filter ini.
              </p>
            ) : (
              filteredSchedules.map((sch) => (
                <div
                  key={sch.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    sch.isConflict
                      ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900/60 shadow-sm'
                      : 'bg-surface-elevated/40 border-border hover:border-brand-soft/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-heading font-bold text-sm text-content-primary truncate">
                          {sch.title}
                        </span>
                        {sch.isConflict && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-800">
                            <AlertTriangle className="w-3 h-3" /> Benturan Waktu Terdeteksi!
                          </span>
                        )}
                        <Badge variant="default" size="sm">
                          {sch.activityName || 'General'}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-content-secondary flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-brand-blue" /> {sch.date} &bull; {sch.startTime} - {sch.endTime} WIB
                        </span>
                        <span className="text-content-muted">Durasi: {sch.durationHours} Jam</span>
                      </div>

                      {sch.description && (
                        <p className="text-xs text-content-muted mt-1">{sch.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          setScheduleToEdit(sch);
                          setIsScheduleModalOpen(true);
                        }}
                        className="p-1 rounded text-content-muted hover:text-content-primary"
                        title="Edit Jadwal"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(sch.id, sch.title)}
                        className="p-1 rounded text-content-muted hover:text-semantic-danger"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* 6.E TASK MANAGEMENT (Right col) */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-brand-blue" />
              <h3 className="font-heading text-base font-bold text-content-primary">
                Task Management
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3 h-3" />}
              onClick={() => {
                setTaskToEdit(null);
                setIsTaskModalOpen(true);
              }}
            >
              Add Task
            </Button>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <p className="text-xs text-content-muted py-6 text-center italic">
                Belum ada tugas tercatat.
              </p>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-surface/50 border-border/50 opacity-70'
                        : 'bg-surface-elevated/40 border-border hover:border-brand-soft/60'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className="mt-0.5 text-content-muted hover:text-brand-blue transition-colors shrink-0"
                      >
                        {isCompleted ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-semibold text-content-primary truncate ${
                            isCompleted ? 'line-through text-content-muted' : ''
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-content-muted mt-0.5">
                          {task.activityName || 'General'} &bull; Deadline: {task.deadline}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-content-secondary mt-1 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              task.priority === 'Urgent'
                                ? 'danger'
                                : task.priority === 'High'
                                ? 'warning'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-[10px] text-content-muted uppercase font-bold">
                            {task.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setTaskToEdit(task);
                            setIsTaskModalOpen(true);
                          }}
                          className="p-1 rounded text-content-muted hover:text-content-primary"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id, task.title)}
                          className="p-1 rounded text-content-muted hover:text-semantic-danger"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* 6.F WORKLOAD DISTRIBUTION VISUALIZATION */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="font-heading text-base sm:text-lg font-bold text-content-primary">
              Workload Distribution
            </h3>
            <p className="text-xs text-content-muted">
              Distribusi alokasi jam kerja berdasarkan aktivitas dan kapasitas waktu mingguan
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-brand-mist/50 dark:bg-brand-tint border border-brand-soft/40 text-xs">
            <span className="text-content-muted">Beban Kerja Tertinggi: </span>
            <span className="font-bold text-brand-navy dark:text-brand-blue">
              {topWorkloadActivity[0]} ({topWorkloadActivity[1]} Jam)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {hoursByActivity.map(([name, hours], idx) => {
            const pct = Math.round((hours / (workloadMetrics.totalHours || 1)) * 100);
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border bg-surface-elevated/40 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-content-primary truncate max-w-[70%]">
                    {name}
                  </span>
                  <span className="font-mono font-bold text-brand-blue">{hours} Jam</span>
                </div>
                <div className="w-full bg-surface border border-border rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-brand-navy dark:bg-brand-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[11px] text-content-muted block">{pct}% dari total waktu kerja</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Modals */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        scheduleToEdit={scheduleToEdit}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
