import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/theme/ThemeContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  Sun,
  Moon,
  RefreshCw,
  Trash2,
  HardDrive,
  Info,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sliders,
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { resetDemoData, user, updateUser } = useApp();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'id' | 'en'>('id');
  const [defaultCurrency, setDefaultCurrency] = useState(user.currency || 'IDR');

  const handleResetConfirm = () => {
    resetDemoData();
    setIsResetModalOpen(false);
    toast({
      title: 'Data Demo Berhasil Direset',
      message: 'Seluruh data portofolio, transaksi, jadwal, dokumen, dan target telah dikembalikan ke kondisi awal PRD v3.1.',
      type: 'info',
    });
  };

  const handleSavePreferences = () => {
    updateUser({ currency: defaultCurrency });
    toast({
      title: 'Preferensi Disimpan',
      message: 'Pengaturan preferensi lokal berhasil diperbarui.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Pengaturan Sistem"
        description="Kelola tema antarmuka, bahasa sistem, preferensi tampilan lokal, dan kontrol data browser."
        breadcrumb={<span>Account / Pengaturan Sistem</span>}
      />

      <div className="max-w-4xl space-y-6">
        {/* 1. Theme Configuration */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Sliders className="w-5 h-5 text-brand-blue" />
            <div>
              <h3 className="font-heading text-base font-bold text-content-primary">
                Tema Antarmuka Visual
              </h3>
              <p className="text-xs text-content-muted">
                Pilih tampilan warna antarmuka yang paling nyaman untuk lingkungan kerja Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left ${
                theme === 'light'
                  ? 'border-brand-blue bg-brand-mist/40 dark:bg-brand-tint/20 ring-2 ring-brand-blue/20'
                  : 'border-border bg-surface hover:border-brand-soft/40'
              }`}
            >
              <div className="p-3 rounded-lg bg-amber-500/10 text-amber-500">
                <Sun className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm text-content-primary">Light Mode (Terang)</p>
                <p className="text-xs text-content-muted mt-0.5">
                  Latar Cloud White &amp; Royal Navy kontras tinggi untuk siang hari.
                </p>
              </div>
              {theme === 'light' && (
                <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left ${
                theme === 'dark'
                  ? 'border-brand-blue bg-brand-mist/40 dark:bg-brand-tint/20 ring-2 ring-brand-blue/20'
                  : 'border-border bg-surface hover:border-brand-soft/40'
              }`}
            >
              <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Moon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-sm text-content-primary">Dark Mode (Gelap)</p>
                <p className="text-xs text-content-muted mt-0.5">
                  Latar Deep Navy #101728 hemat daya dan ramah mata pada malam hari.
                </p>
              </div>
              {theme === 'dark' && (
                <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0" />
              )}
            </button>
          </div>
        </Card>

        {/* 2. Regional & Language Preferences */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <Globe className="w-5 h-5 text-brand-blue" />
            <div>
              <h3 className="font-heading text-base font-bold text-content-primary">
                Bahasa &amp; Mata Uang
              </h3>
              <p className="text-xs text-content-muted">
                Konfigurasi format pelaporan angka finansial dan lokalisasi bahasa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-content-secondary mb-1">
                Bahasa Antarmuka
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'id' | 'en')}
                className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-content-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="id">Bahasa Indonesia (Utama)</option>
                <option value="en">English (US)</option>
              </select>
              <p className="text-[11px] text-content-muted mt-1">
                Seluruh istilah teknis PRD v3.1 disajikan dalam Bahasa Indonesia standar.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-content-secondary mb-1">
                Mata Uang Default
              </label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-content-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <option value="IDR">IDR - Rupiah Indonesia (Rp)</option>
                <option value="USD">USD - United States Dollar ($)</option>
                <option value="SGD">SGD - Singapore Dollar (S$)</option>
              </select>
              <p className="text-[11px] text-content-muted mt-1">
                Format kalkulator dan analitik menggunakan standar {defaultCurrency}.
              </p>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleSavePreferences}>
              Terapkan Preferensi
            </Button>
          </div>
        </Card>

        {/* 3. Local Data Management & Persistence Control */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 border-b border-border pb-3">
            <HardDrive className="w-5 h-5 text-brand-blue" />
            <div>
              <h3 className="font-heading text-base font-bold text-content-primary">
                Penyimpanan Data Lokal Browser
              </h3>
              <p className="text-xs text-content-muted">
                Audit dan kontrol data yang disimpan di localStorage browser Anda.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-content-secondary font-medium">Status Arsitektur:</span>
              <span className="font-semibold text-brand-navy dark:text-brand-blue">
                Frontend-Only Architecture (Tanpa Backend Server)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-content-secondary font-medium">Metode Penyimpanan:</span>
              <span className="font-mono text-content-primary">window.localStorage (Key v4)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-content-secondary font-medium">Keamanan Data:</span>
              <span className="text-content-muted">Data demo tidak dikirimkan ke cloud/server eksternal</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-950/10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <h4 className="font-heading text-sm font-bold text-rose-600 dark:text-rose-400">
                  Reset Seluruh Data Demo
                </h4>
              </div>
              <p className="text-xs text-content-muted max-w-xl">
                Tindakan ini akan mengembalikan seluruh aktivitas, transaksi kas, jadwal kerja, tugas, dokumen, dan target ke kondisi awal PRD. Sangat direkomendasikan sebelum demonstrasi baru.
              </p>
            </div>

            <Button
              variant="danger"
              size="sm"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => setIsResetModalOpen(true)}
            >
              Reset Data Demo
            </Button>
          </div>
        </Card>

        {/* 4. Transparency & PRD Disclosure */}
        <Card className="p-5 bg-surface-elevated/30 border border-border">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-heading font-bold text-content-primary">
                Keterbukaan Teknis Prototipe (PRD Section 17)
              </h4>
              <p className="text-content-muted leading-relaxed">
                MANAJERKAMU adalah prototipe web interaktif. Seluruh data bersifat ilustratif untuk mendemonstrasikan kapabilitas pengelolaan multi-income. Respon AI Assistant merupakan simulasi berbasis aturan lokal tanpa integrasi LLM berbayar.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Confirmation Modal for Reset */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Konfirmasi Reset Data Demo"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-700 dark:text-rose-300">
              <p className="font-bold">Apakah Anda yakin ingin mereset seluruh data?</p>
              <p className="mt-1">
                Seluruh aktivitas baru, mutasi pengeluaran/pemasukan kustom, dan jadwal yang Anda buat selama sesi pengujian akan dihapus dan dikembalikan ke data demo awal PRD v3.1.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setIsResetModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleResetConfirm}
            >
              Ya, Reset Data Sekarang
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
