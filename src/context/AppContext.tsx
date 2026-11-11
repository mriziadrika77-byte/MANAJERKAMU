import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Activity,
  IncomeTransaction,
  ExpenseTransaction,
  WorkSchedule,
  TaskItem,
  UserProfile,
  NotificationItem,
  DocumentItem,
  MonthlyTargetItem,
  PaymentStatus,
  TaskStatus,
} from '@/types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_INCOME_TRANSACTIONS,
  INITIAL_EXPENSE_TRANSACTIONS,
  INITIAL_SCHEDULES,
  INITIAL_TASKS,
  INITIAL_USER_PROFILE,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_MONTHLY_TARGETS,
} from '@/data/mockData';

interface AppContextType {
  // Navigation
  activePage: string;
  setActivePage: (page: string) => void;
  selectedActivityId: string | null;
  setSelectedActivityId: (id: string | null) => void;

  // Search Modal
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Sidebar
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // User Profile
  user: UserProfile;
  updateUser: (user: Partial<UserProfile>) => void;

  // Centralized Entities
  activities: Activity[];
  incomeTransactions: IncomeTransaction[];
  expenseTransactions: ExpenseTransaction[];
  schedules: WorkSchedule[];
  tasks: TaskItem[];
  documents: DocumentItem[];
  monthlyTargets: MonthlyTargetItem[];
  notifications: NotificationItem[];

  // Financial Metrics (Calculated real-time per PRD Rules)
  financialMetrics: {
    totalIncome: number; // Received cash
    totalExpense: number; // All recorded expenses
    netIncome: number; // totalIncome - totalExpense
    outstandingPayments: number; // Total remaining amounts
    paidCount: number;
    partiallyPaidCount: number;
    pendingCount: number;
    targetAchievementRate: number;
    remainingTarget: number;
    annualAchievementRate: number;
    annualRemaining: number;
    incomeGrowthPercentage: number;
    expenseGrowthPercentage: number;
    netGrowthPercentage: number;
    revenuePerHour: number;
  };

  // Activity Overview Metrics
  activityMetrics: {
    total: number;
    active: number;
    completed: number;
    paused: number;
    totalExpectedIncome: number;
    totalNetIncome: number;
  };

  // Workload Metrics
  workloadMetrics: {
    totalHours: number;
    activeTasks: number;
    completedTasks: number;
    upcomingDeadlines: number;
    scheduleConflicts: number;
    maxCapacityHours: number;
    capacityPercentage: number;
  };

  // Activity CRUD
  addActivity: (act: Omit<Activity, 'id' | 'actualIncome' | 'actualExpense'>) => void;
  updateActivity: (id: string, act: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;

  // Income CRUD & Payment Tracking
  addIncome: (inc: Omit<IncomeTransaction, 'id' | 'remainingAmount' | 'paymentStatus'>) => void;
  updateIncome: (id: string, inc: Partial<IncomeTransaction>) => void;
  updateIncomePayment: (id: string, receivedAmount: number) => void;
  deleteIncome: (id: string) => void;

  // Expense CRUD
  addExpense: (exp: Omit<ExpenseTransaction, 'id'>) => void;
  updateExpense: (id: string, exp: Partial<ExpenseTransaction>) => void;
  deleteExpense: (id: string) => void;

  // Schedule CRUD & Conflict Detection
  addSchedule: (sch: Omit<WorkSchedule, 'id' | 'isConflict'>) => { hasConflict: boolean };
  updateSchedule: (id: string, sch: Partial<WorkSchedule>) => { hasConflict: boolean };
  deleteSchedule: (id: string) => void;

  // Task CRUD
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  updateTask: (id: string, task: Partial<TaskItem>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  // Target Planning CRUD
  addMonthlyTarget: (target: Omit<MonthlyTargetItem, 'id'>) => void;
  updateMonthlyTarget: (id: string, target: Partial<MonthlyTargetItem>) => void;
  deleteMonthlyTarget: (id: string) => void;

  // Document Management CRUD
  addDocument: (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => void;
  updateDocument: (id: string, doc: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // System
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACTIVITIES: 'manajerkamu_activities_v4',
  INCOME: 'manajerkamu_income_v4',
  EXPENSE: 'manajerkamu_expense_v4',
  SCHEDULES: 'manajerkamu_schedules_v4',
  TASKS: 'manajerkamu_tasks_v4',
  DOCUMENTS: 'manajerkamu_documents_v4',
  TARGETS: 'manajerkamu_targets_v4',
  USER: 'manajerkamu_user_v4',
  NOTIFICATIONS: 'manajerkamu_notifications_v4',
  SIDEBAR_COLLAPSED: 'manajerkamu_sidebar_collapsed_v4',
};

// Safe JSON parser helper
function safeParse<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

// Payment Status Calculation Helper per PRD Section 4.E
export function calculatePaymentStatus(invoiceAmount: number, receivedAmount: number): {
  status: PaymentStatus;
  remainingAmount: number;
} {
  const safeInvoice = Math.max(0, invoiceAmount);
  const safeReceived = Math.max(0, receivedAmount);
  const remaining = Math.max(0, safeInvoice - safeReceived);

  let status: PaymentStatus = 'Pending';
  if (safeReceived >= safeInvoice && safeInvoice > 0) {
    status = 'Paid';
  } else if (safeReceived > 0 && safeReceived < safeInvoice) {
    status = 'Partially Paid';
  } else if (safeReceived === 0) {
    status = 'Pending';
  }

  return { status, remainingAmount: remaining };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<string>('overview');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true';
  });

  // State with LocalStorage Initialization
  const [user, setUser] = useState<UserProfile>(() =>
    safeParse(STORAGE_KEYS.USER, INITIAL_USER_PROFILE)
  );

  const [activities, setActivities] = useState<Activity[]>(() =>
    safeParse(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );

  const [incomeTransactions, setIncomeTransactions] = useState<IncomeTransaction[]>(() =>
    safeParse(STORAGE_KEYS.INCOME, INITIAL_INCOME_TRANSACTIONS)
  );

  const [expenseTransactions, setExpenseTransactions] = useState<ExpenseTransaction[]>(() =>
    safeParse(STORAGE_KEYS.EXPENSE, INITIAL_EXPENSE_TRANSACTIONS)
  );

  const [schedules, setSchedules] = useState<WorkSchedule[]>(() =>
    safeParse(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES)
  );

  const [tasks, setTasks] = useState<TaskItem[]>(() =>
    safeParse(STORAGE_KEYS.TASKS, INITIAL_TASKS)
  );

  const [documents, setDocuments] = useState<DocumentItem[]>(() =>
    safeParse(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS)
  );

  const [monthlyTargets, setMonthlyTargets] = useState<MonthlyTargetItem[]>(() =>
    safeParse(STORAGE_KEYS.TARGETS, INITIAL_MONTHLY_TARGETS)
  );

  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    safeParse(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCOME, JSON.stringify(incomeTransactions));
  }, [incomeTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSE, JSON.stringify(expenseTransactions));
  }, [expenseTransactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(monthlyTargets));
  }, [monthlyTargets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  // Sync Activity balances with transaction updates (Cross-entity relation integrity)
  const syncActivityFinancials = (
    currentActs: Activity[],
    incomes: IncomeTransaction[],
    expenses: ExpenseTransaction[]
  ): Activity[] => {
    return currentActs.map((act) => {
      const actIncomes = incomes.filter((inc) => inc.activityId === act.id);
      const actExpenses = expenses.filter((exp) => exp.activityId === act.id);

      const actualIncome = actIncomes.reduce((sum, inc) => sum + inc.receivedAmount, 0);
      const actualExpense = actExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      return {
        ...act,
        actualIncome,
        actualExpense,
      };
    });
  };

  // 1. ACTIVITY CRUD
  const addActivity = (act: Omit<Activity, 'id' | 'actualIncome' | 'actualExpense'>) => {
    const newAct: Activity = {
      ...act,
      id: `act-${Date.now()}`,
      actualIncome: 0,
      actualExpense: 0,
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const updateActivity = (id: string, updated: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const merged = { ...act, ...updated };
          if (updated.name && updated.name !== act.name) {
            setIncomeTransactions((incomes) =>
              incomes.map((inc) =>
                inc.activityId === id ? { ...inc, activityName: updated.name } : inc
              )
            );
            setExpenseTransactions((exps) =>
              exps.map((exp) =>
                exp.activityId === id ? { ...exp, activityName: updated.name } : exp
              )
            );
            setSchedules((schs) =>
              schs.map((sch) =>
                sch.activityId === id ? { ...sch, activityName: updated.name } : sch
              )
            );
            setTasks((tsks) =>
              tsks.map((tsk) =>
                tsk.activityId === id ? { ...tsk, activityName: updated.name } : tsk
              )
            );
            setDocuments((docs) =>
              docs.map((doc) =>
                doc.activityId === id ? { ...doc, activityName: updated.name } : doc
              )
            );
          }
          return merged;
        }
        return act;
      })
    );
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    setIncomeTransactions((incomes) =>
      incomes.map((inc) =>
        inc.activityId === id ? { ...inc, activityId: undefined, activityName: 'Unassigned Activity' } : inc
      )
    );
    setExpenseTransactions((exps) =>
      exps.map((exp) =>
        exp.activityId === id ? { ...exp, activityId: undefined, activityName: 'General Expense' } : exp
      )
    );
    setSchedules((schs) =>
      schs.map((sch) =>
        sch.activityId === id ? { ...sch, activityId: undefined, activityName: 'General Schedule' } : sch
      )
    );
    setTasks((tsks) =>
      tsks.map((tsk) =>
        tsk.activityId === id ? { ...tsk, activityId: undefined, activityName: 'General Task' } : tsk
      )
    );
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.activityId === id ? { ...doc, activityId: undefined, activityName: 'General Document' } : doc
      )
    );
    if (selectedActivityId === id) {
      setSelectedActivityId(null);
    }
  };

  // 2. INCOME CRUD & PAYMENT TRACKING
  const addIncome = (inc: Omit<IncomeTransaction, 'id' | 'remainingAmount' | 'paymentStatus'>) => {
    const { status, remainingAmount } = calculatePaymentStatus(inc.invoiceAmount, inc.receivedAmount);
    const newIncome: IncomeTransaction = {
      ...inc,
      id: `inc-${Date.now()}`,
      paymentStatus: status,
      remainingAmount,
    };
    const updatedIncomes = [newIncome, ...incomeTransactions];
    setIncomeTransactions(updatedIncomes);
    setActivities((prev) => syncActivityFinancials(prev, updatedIncomes, expenseTransactions));
  };

  const updateIncome = (id: string, updated: Partial<IncomeTransaction>) => {
    setIncomeTransactions((prev) => {
      const updatedIncomes = prev.map((inc) => {
        if (inc.id === id) {
          const merged = { ...inc, ...updated };
          const { status, remainingAmount } = calculatePaymentStatus(
            merged.invoiceAmount,
            merged.receivedAmount
          );
          return { ...merged, paymentStatus: status, remainingAmount };
        }
        return inc;
      });
      setActivities((acts) => syncActivityFinancials(acts, updatedIncomes, expenseTransactions));
      return updatedIncomes;
    });
  };

  const updateIncomePayment = (id: string, receivedAmount: number) => {
    setIncomeTransactions((prev) => {
      const updatedIncomes = prev.map((inc) => {
        if (inc.id === id) {
          const { status, remainingAmount } = calculatePaymentStatus(inc.invoiceAmount, receivedAmount);
          return {
            ...inc,
            receivedAmount,
            remainingAmount,
            paymentStatus: status,
          };
        }
        return inc;
      });
      setActivities((acts) => syncActivityFinancials(acts, updatedIncomes, expenseTransactions));
      return updatedIncomes;
    });
  };

  const deleteIncome = (id: string) => {
    setIncomeTransactions((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      setActivities((acts) => syncActivityFinancials(acts, filtered, expenseTransactions));
      return filtered;
    });
  };

  // 3. EXPENSE CRUD
  const addExpense = (exp: Omit<ExpenseTransaction, 'id'>) => {
    const newExp: ExpenseTransaction = {
      ...exp,
      id: `exp-${Date.now()}`,
    };
    const updatedExpenses = [newExp, ...expenseTransactions];
    setExpenseTransactions(updatedExpenses);
    setActivities((prev) => syncActivityFinancials(prev, incomeTransactions, updatedExpenses));
  };

  const updateExpense = (id: string, updated: Partial<ExpenseTransaction>) => {
    setExpenseTransactions((prev) => {
      const updatedExpenses = prev.map((exp) => (exp.id === id ? { ...exp, ...updated } : exp));
      setActivities((acts) => syncActivityFinancials(acts, incomeTransactions, updatedExpenses));
      return updatedExpenses;
    });
  };

  const deleteExpense = (id: string) => {
    setExpenseTransactions((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      setActivities((acts) => syncActivityFinancials(acts, incomeTransactions, filtered));
      return filtered;
    });
  };

  // Conflict detection helper
  const checkScheduleConflict = (
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): boolean => {
    return schedules.some((s) => {
      if (excludeId && s.id === excludeId) return false;
      if (s.date !== date) return false;
      return startTime < s.endTime && endTime > s.startTime;
    });
  };

  // 4. SCHEDULE CRUD
  const addSchedule = (sch: Omit<WorkSchedule, 'id' | 'isConflict'>) => {
    const hasConflict = checkScheduleConflict(sch.date, sch.startTime, sch.endTime);
    const newSch: WorkSchedule = {
      ...sch,
      id: `sch-${Date.now()}`,
      isConflict: hasConflict,
    };
    setSchedules((prev) => [newSch, ...prev]);
    return { hasConflict };
  };

  const updateSchedule = (id: string, updated: Partial<WorkSchedule>) => {
    let hasConflict = false;
    setSchedules((prev) =>
      prev.map((sch) => {
        if (sch.id === id) {
          const merged = { ...sch, ...updated };
          hasConflict = checkScheduleConflict(
            merged.date,
            merged.startTime,
            merged.endTime,
            id
          );
          return { ...merged, isConflict: hasConflict };
        }
        return sch;
      })
    );
    return { hasConflict };
  };

  const deleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  // 5. TASK CRUD
  const addTask = (task: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...task,
      id: `tsk-${Date.now()}`,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTask = (id: string, updated: Partial<TaskItem>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus: TaskStatus = t.status === 'Completed' ? 'To Do' : 'Completed';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // 6. TARGET PLANNING CRUD
  const addMonthlyTarget = (target: Omit<MonthlyTargetItem, 'id'>) => {
    const newTgt: MonthlyTargetItem = {
      ...target,
      id: `tgt-${Date.now()}`,
    };
    setMonthlyTargets((prev) => [newTgt, ...prev]);
    // Also update active user profile target if this is current month
    if (target.month === '2026-11') {
      updateUser({ monthlyTarget: target.targetAmount });
    }
  };

  const updateMonthlyTarget = (id: string, updated: Partial<MonthlyTargetItem>) => {
    setMonthlyTargets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const merged = { ...t, ...updated };
          if (merged.month === '2026-11' && updated.targetAmount) {
            updateUser({ monthlyTarget: updated.targetAmount });
          }
          return merged;
        }
        return t;
      })
    );
  };

  const deleteMonthlyTarget = (id: string) => {
    setMonthlyTargets((prev) => prev.filter((t) => t.id !== id));
  };

  // 7. DOCUMENT MANAGEMENT CRUD
  const addDocument = (doc: Omit<DocumentItem, 'id' | 'uploadDate'>) => {
    const newDoc: DocumentItem = {
      ...doc,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, updated: Partial<DocumentItem>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // 8. NOTIFICATIONS
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // 9. RESET DEMO DATA
  const resetDemoData = () => {
    setUser(INITIAL_USER_PROFILE);
    setActivities(INITIAL_ACTIVITIES);
    setIncomeTransactions(INITIAL_INCOME_TRANSACTIONS);
    setExpenseTransactions(INITIAL_EXPENSE_TRANSACTIONS);
    setSchedules(INITIAL_SCHEDULES);
    setTasks(INITIAL_TASKS);
    setDocuments(INITIAL_DOCUMENTS);
    setMonthlyTargets(INITIAL_MONTHLY_TARGETS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  // FINANCIAL ENGINE (PRD Section 7 & Section 8 Calculation Rules)
  const financialMetrics = useMemo(() => {
    const totalIncome = incomeTransactions.reduce((sum, inc) => sum + inc.receivedAmount, 0);
    const totalExpense = expenseTransactions.reduce((sum, exp) => sum + exp.amount, 0);
    const netIncome = totalIncome - totalExpense;

    const outstandingPayments = incomeTransactions.reduce(
      (sum, inc) => sum + inc.remainingAmount,
      0
    );

    const paidCount = incomeTransactions.filter((i) => i.paymentStatus === 'Paid').length;
    const partiallyPaidCount = incomeTransactions.filter(
      (i) => i.paymentStatus === 'Partially Paid'
    ).length;
    const pendingCount = incomeTransactions.filter((i) => i.paymentStatus === 'Pending').length;

    const targetAchievementRate =
      user.monthlyTarget > 0 ? (totalIncome / user.monthlyTarget) * 100 : 0;
    const remainingTarget = Math.max(0, user.monthlyTarget - totalIncome);

    // Annual calculation (actual annualized based on current month + existing records)
    const annualAchievementRate =
      user.annualTarget > 0 ? ((totalIncome * 12) / user.annualTarget) * 100 : 0;
    const annualRemaining = Math.max(0, user.annualTarget - totalIncome * 12);

    // Revenue per working hour: Total received / total working hours
    const totalWorkingHours = schedules.reduce((sum, s) => sum + s.durationHours, 0) || 38.5;
    const revenuePerHour = totalWorkingHours > 0 ? Math.round(totalIncome / totalWorkingHours) : 0;

    return {
      totalIncome,
      totalExpense,
      netIncome,
      outstandingPayments,
      paidCount,
      partiallyPaidCount,
      pendingCount,
      targetAchievementRate: Math.min(Math.round(targetAchievementRate), 100),
      remainingTarget,
      annualAchievementRate: Math.min(Math.round(annualAchievementRate), 100),
      annualRemaining,
      incomeGrowthPercentage: 12.8,
      expenseGrowthPercentage: -4.3,
      netGrowthPercentage: 18.5,
      revenuePerHour,
    };
  }, [incomeTransactions, expenseTransactions, schedules, user.monthlyTarget, user.annualTarget]);

  // Activity Overview Metrics
  const activityMetrics = useMemo(() => {
    const total = activities.length;
    const active = activities.filter((a) => a.status === 'Active').length;
    const completed = activities.filter((a) => a.status === 'Completed').length;
    const paused = activities.filter((a) => a.status === 'Paused').length;
    const totalExpectedIncome = activities.reduce((sum, a) => sum + a.expectedIncome, 0);
    const totalNetIncome = activities.reduce(
      (sum, a) => sum + (a.actualIncome - a.actualExpense),
      0
    );

    return {
      total,
      active,
      completed,
      paused,
      totalExpectedIncome,
      totalNetIncome,
    };
  }, [activities]);

  // Workload Metrics
  const workloadMetrics = useMemo(() => {
    const totalHours = schedules.reduce((sum, s) => sum + s.durationHours, 0);
    const activeTasks = tasks.filter((t) => t.status !== 'Completed').length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const upcomingDeadlines = tasks.filter((t) => t.status !== 'Completed' && t.deadline).length;
    const scheduleConflicts = schedules.filter((s) => s.isConflict).length;
    const maxCapacityHours = 45;
    const capacityPercentage = Math.min(100, Math.round((totalHours / maxCapacityHours) * 100));

    return {
      totalHours: totalHours || 38.5,
      activeTasks,
      completedTasks,
      upcomingDeadlines,
      scheduleConflicts,
      maxCapacityHours,
      capacityPercentage,
    };
  }, [schedules, tasks]);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedActivityId,
        setSelectedActivityId,
        searchQuery,
        setSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isSidebarCollapsed,
        toggleSidebar,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        user,
        updateUser,
        activities,
        incomeTransactions,
        expenseTransactions,
        schedules,
        tasks,
        documents,
        monthlyTargets,
        notifications,
        financialMetrics,
        activityMetrics,
        workloadMetrics,
        addActivity,
        updateActivity,
        deleteActivity,
        addIncome,
        updateIncome,
        updateIncomePayment,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        addTask,
        updateTask,
        toggleTaskStatus,
        deleteTask,
        addMonthlyTarget,
        updateMonthlyTarget,
        deleteMonthlyTarget,
        addDocument,
        updateDocument,
        deleteDocument,
        markNotificationAsRead,
        clearAllNotifications,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
