import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Lock,
  Mail,
  UserCheck,
} from 'lucide-react';

interface DemoLoginProps {
  onLoginSuccess: () => void;
}

export const DemoLogin: React.FC<DemoLoginProps> = ({ onLoginSuccess }) => {
  const { user } = useApp();
  const [email, setEmail] = useState(user.email || 'alex.pratama@manajerkamu.id');
  const [password, setPassword] = useState('demo12345');
  const [role, setRole] = useState('Multi-Role Professional');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess();
  };

  const handleQuickDemoAccess = () => {
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Brand Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-navy text-white shadow-lg shadow-brand-navy/30 mb-2">
          <Briefcase className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-content-primary">
          MANAJERKAMU
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary max-w-sm mx-auto">
          One Person. Multiple Activities. One Integrated System.
        </p>
      </div>

      {/* Main Login Card */}
      <Card className="w-full max-w-md p-6 sm:p-8 space-y-6 shadow-xl border-border bg-surface">
        <div className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-content-primary">
              Demo Login
            </h2>
            <span className="text-[10px] font-bold text-brand-navy dark:text-brand-blue bg-brand-mist dark:bg-brand-tint px-2.5 py-0.5 rounded-full border border-brand-soft/30">
              Interactive Prototype v3.1
            </span>
          </div>
          <p className="text-xs text-content-muted mt-1">
            Masuk langsung sebagai persona multi-peran independen untuk memulai peninjauan.
          </p>
        </div>

        {/* Demo Persona Preset Box */}
        <div className="p-3 rounded-xl bg-brand-mist/40 dark:bg-brand-tint/20 border border-brand-soft/40 space-y-2">
          <div className="flex items-center gap-2.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-blue/30"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-content-primary truncate">{user.name}</p>
              <p className="text-[11px] text-content-muted truncate">{user.title}</p>
            </div>
            <UserCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-content-secondary mb-1">
              Email Akun Demo
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@manajerkamu.id"
              required
              leftIcon={<Mail className="w-4 h-4 text-content-muted" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-secondary mb-1">
              Kata Sandi Demo
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              leftIcon={<Lock className="w-4 h-4 text-content-muted" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-content-secondary mb-1">
              Peran Profesional
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-surface text-content-primary text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
            >
              <option value="Multi-Role Professional">Multi-Role Professional (Default PRD)</option>
              <option value="Freelance Designer">Freelance Designer &amp; Consultant</option>
              <option value="Online Driver">Gig Economy &amp; Driver</option>
              <option value="Private Tutor">Session Educator / Tutor</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center h-11 text-sm font-semibold shadow-md shadow-brand-navy/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Masuk ke Workspace
          </Button>
        </form>

        {/* Quick One-Click Entry */}
        <div className="pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center text-xs text-content-secondary"
            onClick={handleQuickDemoAccess}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-blue" />}
          >
            Akses Langsung 1-Klik (Juri &amp; Demonstrator)
          </Button>
        </div>

        {/* Security & Local Disclosure Note */}
        <div className="flex items-start gap-2 pt-1 text-[11px] text-content-muted">
          <ShieldCheck className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
          <span>
            Simulasi otentikasi lokal di browser. Tanpa backend, tanpa server eksternal (PRD Section 6.1).
          </span>
        </div>
      </Card>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-content-muted flex items-center gap-2">
        <Layers className="w-3.5 h-3.5" />
        <span>MANAJERKAMU &bull; Prototipe Siap Demonstrasi &amp; Penilaian</span>
      </div>
    </div>
  );
};

