import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, Bell, ChevronDown } from 'lucide-react';

// Modular Tab components
import { ProfileTab } from '../components/settings/ProfileTab';
import { AccountTab } from '../components/settings/AccountTab';
import { NotificationsTab } from '../components/settings/NotificationsTab';
import { SecurityTab } from '../components/settings/SecurityTab';
import { IntegrationsTab } from '../components/settings/IntegrationsTab';
import { APIKeysTab } from '../components/settings/APIKeysTab';
import { WebhooksTab } from '../components/settings/WebhooksTab';

export const Profile: React.FC = () => {
  const { organizations, activeOrgId } = useApp();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications' | 'security' | 'integrations' | 'api-keys' | 'webhooks'>('profile');

  // Sub-tabs list
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'account', label: 'Account' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'api-keys', label: 'API Keys' },
    { id: 'webhooks', label: 'Webhooks' },
  ];

  const currentOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  return (
    <div className="space-y-6 animate-fade-in text-slate-705">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account settings and preferences.</p>
        </div>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-2.5">
          {currentOrg && (
            <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
              <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">
                {currentOrg.name.charAt(0)}
              </span>
              <span>{currentOrg.name}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
          )}

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
      </div>

      {/* 2. Sub-tabs */}
      <div className="flex items-center gap-5 border-b border-slate-200 pb-3 text-xs font-semibold flex-shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2 cursor-pointer transition-all border-b-2 text-xs font-semibold ${
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600 font-bold'
                : 'text-slate-400 border-transparent hover:text-slate-655 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Render Modular Tab Content */}
      <div className="mt-6 animate-fade-in">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'integrations' && <IntegrationsTab />}
        {activeTab === 'api-keys' && <APIKeysTab />}
        {activeTab === 'webhooks' && <WebhooksTab />}
      </div>

    </div>
  );
};
