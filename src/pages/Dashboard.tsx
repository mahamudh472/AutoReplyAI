import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DashboardHeader,
  DashboardMetrics,
  DashboardRecentActivity,
  DashboardChannelsChart,
  DashboardConnectionStatus,
  DashboardAIStatusCard,
  DashboardUsageCard,
  DashboardSimulatePanel,
} from '../components/dashboard';

export const Dashboard: React.FC = () => {
  const { organizations, activeOrgId, selectOrg, simulateIncomingMessage } = useApp();

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      {/* 1. Header with Org Switcher */}
      <DashboardHeader
        organizations={organizations}
        activeOrgId={activeOrgId}
        onSelectOrg={selectOrg}
      />

      {/* 2. Key Metrics Grid */}
      <DashboardMetrics />

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Recent Conversations & Channels Donut Chart */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardRecentActivity />
          <DashboardChannelsChart />
        </div>

        {/* Right Column: Connection status, AI summary, Monthly usage */}
        <div className="space-y-6">
          <DashboardConnectionStatus />
          <DashboardAIStatusCard />
          <DashboardUsageCard />
        </div>
      </div>

      {/* 4. Inquiry Simulator Panel */}
      <DashboardSimulatePanel onSimulate={simulateIncomingMessage} />
    </div>
  );
};
