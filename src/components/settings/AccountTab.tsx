import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Plus, Check, Trash2 } from 'lucide-react';

export const AccountTab: React.FC = () => {
  const { organizations, activeOrgId, selectOrg, createOrg } = useApp();
  const [newOrgName, setNewOrgName] = useState('');
  const [orgCreated, setOrgCreated] = useState(false);

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    createOrg(newOrgName);
    setNewOrgName('');
    setOrgCreated(true);
    setTimeout(() => setOrgCreated(false), 3000);
  };

  const currentOrg = organizations.find(o => o.id === activeOrgId) || organizations[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Workspace / Organization Switcher */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Active Workspace</h3>
            <p className="text-xs text-slate-400 mt-0.5">Switch between your active workspaces or organizations.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Current Active Organization</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={activeOrgId || ''}
                  onChange={(e) => selectOrg(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.team.length} {org.team.length === 1 ? 'member' : 'members'})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {currentOrg && (
              <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentOrg.logo} 
                    alt={currentOrg.name} 
                    className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{currentOrg.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Timezone: {currentOrg.timezone} • Language: {currentOrg.language}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold rounded-lg border border-green-200/50">
                  Active Workspace
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Create New Workspace Form */}
        <form onSubmit={handleCreateOrg} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit font-medium">Create New Workspace</h3>
            <p className="text-xs text-slate-400 mt-0.5">Set up an isolated workspace to manage a different business page.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Workspace / Business Name</label>
              <input
                type="text"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="e.g. Acme Retail, Globex Corp"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {orgCreated ? (
                <>
                  <Check className="h-4 w-4" />
                  Workspace Created
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Workspace
                </>
              )}
            </button>
          </div>
        </form>

      </div>

      {/* Right Column (1/3 width) */}
      <div className="space-y-6">
        
        {/* Account Details Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Account Status</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Your ownership details for this account.</p>
          </div>

          <div className="space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Role</span>
              <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-lg border border-blue-200/50">Owner</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-slate-400 font-medium">Member Since</span>
              <span className="font-bold text-slate-700">June 12, 2026</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400 font-medium">Linked Accounts</span>
              <span className="font-bold text-slate-700">{organizations.length} Workspaces</span>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Danger Zone</h3>
            <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">
              Irreversible account operations.
            </p>
          </div>

          <button
            type="button"
            className="w-full py-2.5 rounded-xl border border-rose-250 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            Deactivate Account
          </button>
        </div>

      </div>
    </div>
  );
};
