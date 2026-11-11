export type ActivityCategory = 'Project-based' | 'Platform-based' | 'Session-based' | 'Business-based';
export type ActivityStatus = 'Active' | 'Paused' | 'Completed' | 'Archived';
export type PaymentModel = 'Hourly' | 'Fixed / Milestone' | 'Commission / Revenue Share' | 'Per Session' | 'Retail Margin';

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending';
export type ExpenseCategory =
  | 'Transportation'
  | 'Equipment'
  | 'Subscription'
  | 'Communication'
  | 'Operational'
  | 'Marketing'
  | 'Other Expenses';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  description: string;
  clientOrPlatform: string;
  paymentModel: PaymentModel;
  expectedIncome: number;
  operationalCost: number;
  actualIncome: number;
  actualExpense: number;
  startDate: string;
  status: ActivityStatus;
  hoursWorked: number;
  notes?: string;
}

export interface IncomeTransaction {
  id: string;
  description: string;
  activityId?: string;
  activityName?: string;
  invoiceAmount: number;
  receivedAmount: number;
  remainingAmount: number;
  date: string;
  paymentSource: string;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface ExpenseTransaction {
  id: string;
  description: string;
  activityId?: string;
  activityName?: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: string;
  notes?: string;
}

export interface WorkSchedule {
  id: string;
  title: string;
  activityId?: string;
  activityName?: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  status: 'Scheduled' | 'In Progress' | 'Completed';
  durationHours: number;
  isConflict?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  activityId?: string;
  activityName?: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  description?: string;
}

export interface MonthlyTargetItem {
  id: string;
  name: string;
  targetAmount: number;
  month: string; // e.g. "2026-11"
  year: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  title: string;
  monthlyTarget: number;
  annualTarget: number;
  currency: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'danger';
}

export type DocumentCategory = 'Contract' | 'Invoice' | 'Project Report' | 'Payment Proof' | 'Other Documents';

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  activityId?: string;
  activityName?: string;
  uploadDate: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  description?: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  insightCards?: {
    title: string;
    value: string;
    subtitle?: string;
    type?: 'success' | 'warning' | 'info';
  }[];
  suggestedFollowUps?: string[];
}
