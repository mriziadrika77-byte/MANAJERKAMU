import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/utils';
import {
  User,
  Mail,
  Briefcase,
  Target,
  DollarSign,
  Save,
  CheckCircle2,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProfileModule: React.FC = () => {
  const { user, updateUser, activities, financialMetrics } = useApp();
  const { toast } = useToast();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [monthlyTarget, setMonthlyTarget] = useState(user.monthlyTarget.toString());
  const [annualTarget, setAnnualTarget] = useState(user.annualTarget.toString());
  const [currency, setCurrency] = useState(user.currency || 'IDR');
  const [avatar, setAvatar] = useState(user.avatar);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numMonthly = parseFloat(monthlyTarget) || 0;
    const numAnnual = parseFloat(annualTarget) || 0;

    updateUser({
      name,
      email,
      title,
      monthlyTarget: numMonthly,
      annualTarget: numAnnual,
      currency,
      avatar,
    });

    setIsSaved(true);
    toast({
      title: 'Profil Berhasil Diperbarui',
      message: 'Perubahan data profil dan target finansial telah tersimpan ke sistem.',
      type: 'success',
    });

    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <PageHeader
        title="Profil Pengguna"
        description="Kelola identitas personal, portofolio profesional, dan preferensi target ekonomi Anda."
        breadcrumb={<span>Account / Profil Pengguna</span>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="text-center p-6 space-y-4">
            <div className="relative inline-block mx-auto">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-blue/20 shadow-md mx-auto"
              />
              <span className="absolute bottom-0 right-0 p-1.5 bg-emerald-500 rounded-full border-2 border-surface text-white" title="Active">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <h2 className="font-heading text-lg font-bold text-content-primary">{name}</h2>
              <p className="text-xs text-content-muted mt-0.5">{title}</p>
              <span className="inline-block mt-2 text-[11px] font-semibold text-brand-navy dark:text-brand-blue bg-brand-mist dark:bg-brand-tint px-2.5 py-0.5 rounded-full">
                Multi-Income Independent
              </span>
            </div>

            <div className="pt-4 border-t border-border grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-surface-elevated/40">
                <span className="text-content-muted block text-[10px]">Aktivitas Aktif</span>
                <span className="font-bold text-content-primary text-sm">
                  {activities.filter((a) => a.status === 'Active').length}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface-elevated/40">
                <span className="text-content-muted block text-[10px]">Target Bulanan</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                  {formatCurrency(user.monthlyTarget)}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Stats Card */}
          <Card className="space-y-3">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-content-muted">
              Integritas & Status Akun
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border">
                <span className="text-content-muted flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-brand-blue" /> Tipe Autentikasi
                </span>
                <span className="font-medium text-content-primary">Demo Session (Lokal)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border">
                <span className="text-content-muted flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-blue" /> Sinkronisasi
                </span>
                <span className="font-medium text-content-primary">Browser LocalStorage</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-content-muted flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand-blue" /> Capaian Finansial
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {financialMetrics.targetAchievementRate}% Tercapai
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card className="space-y-6">
            <div className="border-b border-border pb-4">
              <h3 className="font-heading text-base font-bold text-content-primary">
                Informasi Personal & Profesional
              </h3>
              <p className="text-xs text-content-muted mt-1">
                Perubahan pada nama dan target akan langsung tercermin di Dashboard, Financial Planning, dan AI Assistant.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Nama Lengkap
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Lengkap"
                    required
                    leftIcon={<User className="w-4 h-4 text-content-muted" />}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Alamat Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    required
                    leftIcon={<Mail className="w-4 h-4 text-content-muted" />}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">
                  Profesi / Peran Kerja
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Freelance UI Designer & Tutor"
                  required
                  leftIcon={<Briefcase className="w-4 h-4 text-content-muted" />}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">
                  URL Avatar (Foto Profil)
                </label>
                <Input
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://..."
                />
                <p className="text-[11px] text-content-muted mt-1">
                  Masukkan tautan gambar langsung untuk foto profil akun Anda.
                </p>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-heading text-sm font-bold text-content-primary mb-3">
                  Target Finansial Terpusat
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-content-secondary mb-1">
                      Target Pendapatan Bulanan (Rp)
                    </label>
                    <Input
                      type="number"
                      value={monthlyTarget}
                      onChange={(e) => setMonthlyTarget(e.target.value)}
                      placeholder="30000000"
                      required
                      leftIcon={<Target className="w-4 h-4 text-content-muted" />}
                    />
                    <p className="text-[11px] text-content-muted mt-1">
                      Saat ini: {formatCurrency(parseFloat(monthlyTarget) || 0)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-content-secondary mb-1">
                      Target Pendapatan Tahunan (Rp)
                    </label>
                    <Input
                      type="number"
                      value={annualTarget}
                      onChange={(e) => setAnnualTarget(e.target.value)}
                      placeholder="360000000"
                      required
                      leftIcon={<DollarSign className="w-4 h-4 text-content-muted" />}
                    />
                    <p className="text-[11px] text-content-muted mt-1">
                      Saat ini: {formatCurrency(parseFloat(annualTarget) || 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">
                  Mata Uang Utama
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-content-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="IDR">IDR (Rupiah Indonesia - Rp)</option>
                  <option value="USD">USD (US Dollar - $)</option>
                  <option value="SGD">SGD (Singapore Dollar - S$)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-between">
                {isSaved ? (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" /> Perubahan tersimpan
                  </span>
                ) : (
                  <span />
                )}

                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  Simpan Perubahan Profil
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

