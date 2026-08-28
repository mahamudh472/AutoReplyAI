import React, { useState } from 'react';
import { ChevronDown, Calendar, Bell } from 'lucide-react';
import type { Organization } from '../../types/organization';

interface DashboardHeaderProps {
  organizations: Organization[];
  activeOrgId: string | null;
  onSelectOrg: (id: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  organizations,
  activeOrgId,
  onSelectOrg,
}) => {
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 font-outfit">Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Welcome back, <span className="text-slate-800 font-semibold">Mahmudul Hasan</span> 👋
        </p>
      </div>

      {/* Top Header Actions */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Org Selector Switcher */}
        <div className="relative">
          <button
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <img src={activeOrg?.logo} alt={activeOrg?.name} className="h-4 w-4 rounded object-cover" />
            <span>{activeOrg?.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {orgDropdownOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOrgDropdownOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-1">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      onSelectOrg(org.id);
                      setOrgDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs cursor-pointer ${
                      org.id === activeOrgId
                        ? 'bg-blue-50 text-blue-600 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <img src={org.logo} alt={org.name} className="h-4.5 w-4.5 rounded object-cover" />
                    <span className="truncate">{org.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Date Picker Selector */}
        <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>May 20 – May 26, 2024</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
        </button>
      </div>
    </div>
  );
};
