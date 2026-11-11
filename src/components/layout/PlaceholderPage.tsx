import React from 'react';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/ui/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Briefcase,
  ArrowDownUp,
  CalendarDays,
  Target,
  Bot,
  FileText,
  BarChart3,
  User,
  Settings,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface PlaceholderProps {
  pageId: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({ pageId }) => {
  const { setActivePage } = useApp();

  const pagesMap: Record<
    string,
    { title: string; section: string; description: string; icon: React.ReactNode; nextPhase: string }
  > = {
    activities: {
      title: 'My Activities Portfolio',
      section: 'Workspace',
      description: 'Manajemen portofolio terpadu: Project-based, Platform-based, Session-based, dan Business-based.',
      icon: <Briefcase className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 3 (Unified Activity Portfolio)',
    },
    'income-expenses': {
      title: 'Income & Expense Management',
      section: 'Workspace',
      description: 'Pencatatan mutasi arus kas, rekonsiliasi pembayaran bertahap, dan pengelompokan biaya operasional.',
      icon: <ArrowDownUp className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 4 (Income & Expense Management)',
    },
    schedule: {
      title: 'Workload & Schedule Management',
      section: 'Workspace',
      description: 'Kalender jadwal terintegrasi lintas aktivitas, batas kapasitas jam kerja, dan deteksi benturan waktu.',
      icon: <CalendarDays className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 5 (Workload & Time Management)',
    },
    'financial-planning': {
      title: 'Financial Planning & Forecasting',
      section: 'Workspace',
      description: 'Target pendapatan bulanan, simulasi kalkulator skenario bisnis, dan tracking progres target ekonomi.',
      icon: <Target className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 6 (Financial Planning & Forecasting)',
    },
    'ai-assistant': {
      title: 'AI Personal Assistant',
      section: 'Intelligence',
      description: 'Asisten analitik data lokal untuk rekomendasi efisiensi waktu, margin aktivitas, dan pertanyaan cepat.',
      icon: <Bot className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 7 (AI Personal Assistant Prototype)',
    },
    documents: {
      title: 'My Documents Repository',
      section: 'Intelligence',
      description: 'Penyimpanan lokal dokumen kontrak, invoice tagihan klien, laporan proyek, dan kuitansi.',
      icon: <FileText className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 8 (Document Management)',
    },
    analytics: {
      title: 'Analytics & Financial Reports',
      section: 'Intelligence',
      description: 'Laporan komprehensif performa pendapatan bersih, jam kerja produktif, dan profitabilitas aktivitas.',
      icon: <BarChart3 className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 9 (Analytics & Reports)',
    },
    profile: {
      title: 'User Profile & Identity',
      section: 'Account',
      description: 'Pengaturan profil independen, portofolio keahlian, dan konfigurasi identitas visual demo.',
      icon: <User className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 10 (Profile & Preferences)',
    },
    settings: {
      title: 'System Settings & Data Control',
      section: 'Account',
      description: 'Konfigurasi mata uang default, format tanggal, reset data demo lokal, dan backup data browser.',
      icon: <Settings className="w-8 h-8 text-brand-blue" />,
      nextPhase: 'Phase 10 (Settings & Local Persistence)',
    },
  };

  const current = pagesMap[pageId] || {
    title: 'Halaman Modul',
    section: 'Workspace',
    description: 'Modul ini dijadwalkan pada roadmap implementasi berikutnya.',
    icon: <Sparkles className="w-8 h-8 text-brand-blue" />,
    nextPhase: 'Tahap Lanjutan',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={current.title}
        description={current.description}
        breadcrumb={<span>{current.section} / {current.title}</span>}
        action={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => setActivePage('overview')}
          >
            Kembali ke Overview
          </Button>
        }
      />

      <div className="rounded-card border border-border bg-surface p-8">
        <EmptyState
          icon={current.icon}
          title={`Modul Terstruktur: ${current.title}`}
          description={`Kerangka navigasi dan tata letak untuk ${current.title} telah siap terhubung. Implementasi fitur interaktif mendalam modul ini dialokasikan pada ${current.nextPhase} sesuai urutan PRD.`}
          actionLabel="Buka Overview Dashboard"
          onAction={() => setActivePage('overview')}
        />
        <div className="mt-6 flex justify-center">
          <Badge variant="default" size="md">
            Roadmap Aligned: {current.nextPhase}
          </Badge>
        </div>
      </div>
    </div>
  );
};

