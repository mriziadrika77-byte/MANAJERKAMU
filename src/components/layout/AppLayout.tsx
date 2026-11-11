import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SearchModal } from './SearchModal';

interface AppLayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, onLogout }) => {
  return (
    <div className="min-h-screen bg-surface-bg flex text-content-primary antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navigation Bar */}
        <Topbar onLogout={onLogout} />

        {/* Dynamic Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 animate-in fade-in duration-150">
          {children}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-border bg-surface/50 py-4 px-4 sm:px-6 lg:px-8 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-content-muted">
            <div>
              <span className="font-semibold text-content-primary">MANAJERKAMU</span> &bull; One Person. Multiple Activities. One Integrated System.
            </div>
            <div>Interactive SaaS Prototype v3.1 &bull; Phase 5 Final Integrated</div>
          </div>
        </footer>
      </div>

      {/* Global Quick Search Modal */}
      <SearchModal />
    </div>
  );
};
