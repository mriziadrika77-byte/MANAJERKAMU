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
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'activities', label: 'My Activities', icon: <Briefcase className="w-4 h-4 shrink-0" /> },
    { id: 'income-expenses', label: 'Income & Expenses', icon: <ArrowDownUp className="w-4 h-4 shrink-0" /> },
    { id: 'schedule', label: 'Workload & Schedule', icon: <CalendarDays className="w-4 h-4 shrink-0" /> },
    { id: 'financial-planning', label: 'Financial Planning', icon: <Target className="w-4 h-4 shrink-0" /> },
  ];

  const intelligenceNav: NavItem[] = [
    { id: 'ai-assistant', label: 'AI Assistant', icon: <Bot className="w-4 h-4 shrink-0" />, badge: 'AI' },
    { id: 'documents', label: 'My Documents', icon: <FileText className="w-4 h-4 shrink-0" /> },
    { id: 'analytics', label: 'Analytics & Reports', icon: <BarChart3 className="w-4 h-4 shrink-0" /> },
  ];

  const accountNav: NavItem[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4 shrink-0" /> },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    setIsMobileSidebarOpen(false);
  };

  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="py-2">
      {!isSidebarCollapsed && (
        <h4 className="px-3.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-content-muted">
          {title}
        </h4>
      )}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = activePage === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 text-left relative group',
                  isActive
                    ? 'bg-brand-navy text-white shadow-sm dark:bg-brand-blue dark:text-surface-bg font-semibold'
                    : 'text-content-secondary hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5',
                  isSidebarCollapsed && 'justify-center px-2'
                )}
              >
                <span className={cn('transition-transform group-hover:scale-105', isActive && 'text-white dark:text-surface-bg')}>
                  {item.icon}
                </span>

                {!isSidebarCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}

                {!isSidebarCollapsed && item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-soft/20 text-brand-blue dark:text-brand-soft border border-brand-soft/30">
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
            <div className="w-8 h-8 rounded-xl bg-brand-navy dark:bg-brand-blue flex items-center justify-center text-white shadow-sm font-heading font-extrabold text-base shrink-0">
              M
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading font-extrabold text-sm tracking-tight text-content-primary">
                MANAJER<span className="text-brand-blue">KAMU</span>
              </span>
              <span className="text-[9px] text-content-muted tracking-wider uppercase font-semibold mt-1">
                Integrated Work OS
              </span>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-brand-navy dark:bg-brand-blue flex items-center justify-center text-white shadow-sm font-heading font-extrabold text-base">
            M
          </div>
        )}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          title={isSidebarCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 divide-y divide-border/40">
        {renderNavGroup('Workspace', workspaceNav)}
        {renderNavGroup('Intelligence', intelligenceNav)}
        {renderNavGroup('Account', accountNav)}
      </div>

      {/* Bottom User Card / Status */}
      <div className="p-3 border-t border-border shrink-0 bg-surface-elevated/40">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-blue/20 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-content-primary truncate">{user.name}</p>
              <p className="text-[10px] text-content-muted truncate">{user.title}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-brand-blue/20"
              title={user.name}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col shrink-0 transition-all duration-200 z-30 sticky top-0 h-screen',
          isSidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 lg:hidden transition-transform duration-200 ease-in-out shadow-2xl',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
