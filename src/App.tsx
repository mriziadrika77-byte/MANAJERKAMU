import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { ActivitiesModule } from '@/components/activities/ActivitiesModule';
import { FinancesModule } from '@/components/finances/FinancesModule';
import { WorkloadModule } from '@/components/workload/WorkloadModule';
import { FinancialPlanningModule } from '@/components/planning/FinancialPlanningModule';
import { AIAssistantModule } from '@/components/assistant/AIAssistantModule';
import { AnalyticsModule } from '@/components/analytics/AnalyticsModule';
import { DocumentsModule } from '@/components/documents/DocumentsModule';
import { ProfileModule } from '@/components/profile/ProfileModule';
import { SettingsModule } from '@/components/settings/SettingsModule';
import { DemoLogin } from '@/components/auth/DemoLogin';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';

export const App: React.FC = () => {
  const { activePage } = useApp();

  // Demo Authentication State (Simulation without server per PRD Section 6.1 & Section 9)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('manajerkamu_auth_simulation') !== 'false';
  });

  const handleLogin = () => {
    localStorage.setItem('manajerkamu_auth_simulation', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.setItem('manajerkamu_auth_simulation', 'false');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <DemoLogin onLoginSuccess={handleLogin} />;
  }

  const renderActiveModule = () => {
    switch (activePage) {
      case 'overview':
        return <OverviewDashboard />;
      case 'activities':
        return <ActivitiesModule />;
      case 'income-expenses':
        return <FinancesModule />;
      case 'schedule':
        return <WorkloadModule />;
      case 'financial-planning':
        return <FinancialPlanningModule />;
      case 'ai-assistant':
        return <AIAssistantModule />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'documents':
        return <DocumentsModule />;
      case 'profile':
        return <ProfileModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <PlaceholderPage pageId={activePage} />;
    }
  };

  return <AppLayout onLogout={handleLogout}>{renderActiveModule()}</AppLayout>;
};

export default App;
