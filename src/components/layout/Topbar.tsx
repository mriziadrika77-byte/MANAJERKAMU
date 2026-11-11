import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Menu,
  Search,
  Bell,
  ChevronRight,
  User,
  Settings,
  LogOut,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface TopbarProps {
  onLogout?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onLogout }) => {
  const {
    activePage,
    setActivePage,
    setIsMobileSidebarOpen,
    setIsSearchModalOpen,
    user,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    resetDemoData,
  } = useApp();
  const { toast } = useToast();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const pageTitles: Record<string, { title: string; section: string }> = {
    overview: { title: 'Overview Dashboard', section: 'Workspace' },
    activities: { title: 'My Activities Portfolio', section: 'Workspace' },
    'income-expenses': { title: 'Income & Expense Records', section: 'Workspace' },
    schedule: { title: 'Workload & Schedule', section: 'Workspace' },
    'financial-planning': { title: 'Financial Planning & Forecast', section: 'Workspace' },
    'ai-assistant': { title: 'AI Personal Assistant', section: 'Intelligence' },
    documents: { title: 'My Documents Repository', section: 'Intelligence' },
    analytics: { title: 'Analytics & Financial Reports', section: 'Intelligence' },
    profile: { title: 'User Profile & Identity', section: 'Account' },
    settings: { title: 'Preferences & System Settings', section: 'Account' },
  };

  const currentMeta = pageTitles[activePage] || { title: 'Overview', section: 'Workspace' };

  return (
    <header className="sticky top-0 z-20 w-full h-16 bg-surface/85 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 -ml-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <nav className="flex items-center gap-1.5 text-xs text-content-muted">
            <span className="hover:text-content-primary cursor-pointer" onClick={() => setActivePage('overview')}>
              MANAJERKAMU
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-content-secondary font-medium">{currentMeta.section}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-navy dark:text-brand-blue font-semibold">{currentMeta.title}</span>
          </nav>
        </div>
      </div>

      {/* Right: Search, Notif, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar / Trigger */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-elevated/50 text-content-muted hover:text-content-primary hover:border-brand-soft/60 transition-colors text-xs sm:text-sm w-36 sm:w-56"
        >
          <Search className="w-4 h-4 shrink-0 text-content-muted" />
          <span className="truncate">Cari aktivitas, invoice...</span>
          <kbd className="hidden sm:inline-block ml-auto text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative"
            title="Notifikasi"
            aria-label="Buka Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-semantic-danger ring-2 ring-surface" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface border border-border rounded-xl shadow-dropdown z-50 p-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-semibold text-sm text-content-primary">Notifikasi</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-semantic-info/10 text-semantic-info font-bold">
                      {unreadCount} Baru
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => notifications.forEach((n) => markNotificationAsRead(n.id))}
                    className="text-xs text-brand-blue hover:underline font-medium"
                  >
                    Tandai semua dibaca
                  </button>
                )}
              </div>

              <div className="py-2 max-h-72 overflow-y-auto space-y-2 divide-y divide-border/40">
                {notifications.length === 0 ? (
                  <p className="text-xs text-center text-content-muted py-6">Tidak ada notifikasi saat ini.</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className="pt-2 flex items-start gap-3 cursor-pointer group hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors"
                    >
                      <div className="mt-0.5">
                        {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-semantic-success" />}
                        {notif.type === 'warning' && <AlertTriangle className="w-4 h-4 text-semantic-warning" />}
                        {notif.type === 'info' && <Info className="w-4 h-4 text-semantic-info" />}
                        {notif.type === 'danger' && <AlertTriangle className="w-4 h-4 text-semantic-danger" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-content-primary truncate">{notif.title}</p>
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-brand-blue" />}
                        </div>
                        <p className="text-xs text-content-secondary mt-0.5 line-clamp-2">{notif.message}</p>
                        <span className="text-[10px] text-content-muted mt-1 block">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="pt-2 border-t border-border flex justify-end">
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-content-muted hover:text-content-primary"
                  >
                    Bersihkan Riwayat
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 rounded-full border border-border hover:border-brand-soft focus:outline-none transition-colors"
            aria-label="Profile Menu"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-xl shadow-dropdown z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-sm font-semibold text-content-primary leading-tight">{user.name}</p>
                <p className="text-xs text-content-muted truncate mt-0.5">{user.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-brand-navy dark:text-brand-blue bg-brand-mist dark:bg-brand-tint px-2 py-0.5 rounded-full">
                  Demo User
                </span>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    setActivePage('profile');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-content-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <User className="w-4 h-4 text-content-muted" />
                  <span>Profil Akun</span>
                </button>

                <button
                  onClick={() => {
                    setActivePage('settings');
                    setIsProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-content-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-content-muted" />
                  <span>Pengaturan</span>
                </button>

                <button
                  onClick={() => {
                    resetDemoData();
                    setIsProfileOpen(false);
                    toast({
                      title: 'Data Demo Direset',
                      message: 'Data aktivitas dan transaksi dikembalikan ke nilai awal.',
                      type: 'info',
                    });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-content-primary hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <RefreshCw className="w-4 h-4 text-content-muted" />
                  <span>Reset Data Demo</span>
                </button>

                <div className="pt-1 border-t border-border mt-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      if (onLogout) {
                        onLogout();
                      } else {
                        toast({
                          title: 'Simulasi Logout',
                          message: 'Sesi akun demo ditutup.',
                          type: 'info',
                        });
                      }
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm text-semantic-danger hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors text-left font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Demo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

