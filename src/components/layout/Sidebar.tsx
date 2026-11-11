import React from 'react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  ArrowDownUp,
  CalendarDays,
  Target,
  Bot,
  FileText,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC = () => {
  const {
    activePage,
    setActivePage,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    user,
  } = useApp();

  const workspaceNav: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'activities', label: 'My Activities', icon: <Briefcase className="w-5 h-5 shrink-0" /> },
    { id: 'income-expenses', label: 'Income & Expenses', icon: <ArrowDownUp className="w-5 h-5 shrink-0" /> },
    { id: 'schedule', label: 'Workload & Schedule', icon: <CalendarDays className="w-5 h-5 shrink-0" /> },
    { id: 'financial-planning', label: 'Financial Planning', icon: <Target className="w-5 h-5 shrink-0" /> },
  ];

  const intelligenceNav: NavItem[] = [
    { id: 'ai-assistant', label: 'AI Assistant', icon: <Bot className="w-5 h-5 shrink-0" />, badge: 'Smart' },
    { id: 'documents', label: 'My Documents', icon: <FileText className="w-5 h-5 shrink-0" /> },
    { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-5 h-5 shrink-0" /> },
  ];

  const accountNav: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsMobileSidebarOpen(false);
  };

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="py-2.5">
      {!isSidebarCollapsed && (
        <h4 className="px-3.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-content-muted/80">
          {title}
        </h4>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left relative group',
                  isActive
                    ? 'bg-brand-navy text-white shadow-sm dark:bg-brand-blue dark:text-surface-bg font-semibold'
                    : 'text-content-secondary hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5',
                  isSidebarCollapsed && 'justify-center px-2'
                )}
              >
                {/* Active indicator bar */}
                {isActive && !isSidebarCollapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white dark:bg-surface-bg rounded-r-full" />
                )}

                <span className={cn('transition-transform group-hover:scale-105', isActive && 'text-white dark:text-surface-bg')}>
                  {item.icon}
                </span>

                {!isSidebarCollapsed && (
                  <span className="flex-1 truncate tracking-tight">{item.label}</span>
                )}

                {!isSidebarCollapsed && item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-soft/20 text-brand-blue dark:text-brand-soft border border-brand-soft/40">
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-border select-none">
      {/* Brand Header */}
      <div className={cn('h-16 flex items-center px-4 border-b border-border justify-between shrink-0', isSidebarCollapsed && 'justify-center px-2')}>
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-brand-navy dark:bg-brand-blue flex items-center justify-center text-white shadow-sm font-heading font-extrabold text-lg shrink-0">
              M
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold text-base tracking-tight text-content-primary">
                MANAJER<span className="text-brand-blue">KAMU</span>
              </span>
              <span className="text-[10px] text-content-muted tracking-wider uppercase font-semibold mt-1">
                Integrated Work OS
              </span>
            </div>
          </div>
        ) : (
          <div className="w-9 h-9 rounded-xl bg-brand-navy dark:bg-brand-blue flex items-center justify-center text-white shadow-sm font-heading font-extrabold text-lg">
            M
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          title={isSidebarCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Link Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-2 divide-y divide-border/60">
        {renderNavGroup('Workspace', workspaceNav)}
        {renderNavGroup('Intelligence', intelligenceNav)}
        {renderNavGroup('Account', accountNav)}
      </div>

      {/* Pro Badge Feature / Assistant Teaser */}
      {!isSidebarCollapsed && (
        <div className="px-3 pb-3">
          <div className="p-3 rounded-xl bg-brand-mist dark:bg-brand-tint border border-brand-soft/40 flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-brand-navy text-white dark:bg-brand-blue dark:text-surface-bg shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-brand-navy dark:text-brand-blue">One Integrated System</p>
              <p className="text-[11px] text-content-secondary mt-0.5 line-clamp-2">
                Semua pekerjaan, invoice, dan jadwal tersinkronisasi otomatis.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* User Section Bottom */}
      <div className={cn('p-3 border-t border-border shrink-0 flex items-center gap-3', isSidebarCollapsed && 'justify-center p-2')}>
        <img
          src={user.avatar}
          alt={user.name}
          className="w-9 h-9 rounded-full object-cover border-2 border-brand-soft shrink-0"
        />
        {!isSidebarCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-content-primary truncate leading-tight">{user.name}</p>
            <p className="text-xs text-content-muted truncate">{user.title}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden lg:block sticky top-0 h-screen transition-all duration-300 z-30 shrink-0',
          isSidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-deep-charcoal/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-surface shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

