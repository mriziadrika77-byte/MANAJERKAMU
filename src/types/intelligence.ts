export type DocumentCategory = 'Kontrak' | 'Invoice' | 'Laporan Proyek' | 'Bukti Pembayaran';

export interface DocumentItem {
  id: string;
  title: string;
  category: DocumentCategory;
  activityId?: string;
  activityName?: string;
  fileSize: string;
  uploadDate: string;
  fileType: string;
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

