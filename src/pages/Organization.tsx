import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  HelpCircle, 
  Bell, 
  ChevronDown, 
  Globe, 
  Clock, 
  Copy, 
  Trash2, 
  Check, 
  Store
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Organization: React.FC = () => {
  const { organizations, activeOrgId, updateOrgSettings } = useApp();

  const org = organizations.find(o => o.id === activeOrgId) || organizations[0];

  const [name, setName] = useState(org.name);
  const [slug, setSlug] = useState('abc-store');
  const [logo] = useState(org.logo);
  const [timezone, setTimezone] = useState(org.timezone || 'GMT+06:00');
  const [language, setLanguage] = useState(org.language || 'English');
  const [description, setDescription] = useState('We sell high-quality products and provide excellent customer support.');
  
  const [saved, setSaved] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText('org_8f3a7b2d6c1e4a9b');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings({
      name,
      logo,
      timezone,
      language
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2050);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-750">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">Organization</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your organization details and preferences.</p>
        </div>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">A</span>
            <span>ABC Store</span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </div>

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-405 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
      </div>

      {/* 2. Detail sub-tabs */}
      <div className="flex items-center gap-5 border-b border-slate-200 pb-3 text-xs font-semibold flex-shrink-0">
        <button className="pb-2 text-blue-600 border-b-2 border-blue-600 font-bold">
          Organization Details
        </button>
        <button className="pb-2 text-slate-400 hover:text-slate-650">
          Business Hours
        </button>
        <button className="pb-2 text-slate-400 hover:text-slate-650">
          Default Settings
        </button>
        <button className="pb-2 text-slate-400 hover:text-slate-650">
          Data & Privacy
        </button>
      </div>

      {/* 3. Columns Grid (Left: Settings Form, Right: Plan & API details) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Settings Card */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Organization Information</h3>
            <p className="text-xs text-slate-400 mt-0.5">Update your organization's basic information.</p>
          </div>

          {/* Logo Upload Slot */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Logo</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-50/70 border border-slate-200 flex items-center justify-center text-blue-600 flex-shrink-0">
                <Store className="h-8 w-8 text-blue-600" />
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    className="px-3 py-1.5 border border-slate-250 hover:bg-slate-50 text-blue-600 hover:text-blue-700 font-semibold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Change Logo
                  </button>
                  <button 
                    type="button" 
                    className="px-3 py-1.5 text-rose-600 hover:text-rose-700 font-semibold text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">JPG, PNG or SVG. Max size 2MB.</p>
              </div>
            </div>
          </div>

          {/* Business Name Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Organization Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
              required
            />
          </div>

          {/* URL Slug Field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Organization Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-805 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
              required
            />
            <p className="text-[10px] text-slate-400">This will be used in your organization URL.</p>
          </div>

          {/* Language & Timezone Grid Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Language */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Default Language</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="English">English (US)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="French">French (Français)</option>
                </select>
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Timezone</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-750 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                >
                  <option value="GMT+06:00">(GMT+06:00) Dhaka, Bangladesh</option>
                  <option value="GMT-08:00">(GMT-08:00) Pacific Time (US & Canada)</option>
                  <option value="GMT-05:00">(GMT-05:00) Eastern Time (US & Canada)</option>
                  <option value="GMT+00:00">(GMT+00:00) London, United Kingdom</option>
                  <option value="GMT+08:00">(GMT+08:00) Singapore, Singapore</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Organization Description (Optional)</label>
            <div className="relative">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                rows={4}
                className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 leading-relaxed resize-none shadow-sm"
                placeholder="Brief description of your business..."
              />
              <span className="absolute bottom-2.5 right-3 text-[9px] text-slate-400 font-bold">
                {description.length} / 500
              </span>
            </div>
          </div>

          {/* Save Button Row */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-305 animate-pulse" />
                  Changes Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

        {/* Right Column: SaaS plan info & Delete Trigger */}
        <div className="space-y-6">
          
          {/* Plan Info Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Your Plan</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Your organization's current subscription.</p>
            </div>

            {/* Plan Info box */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3.5 text-xs text-slate-600 font-medium">
              <div className="flex justify-between items-center">
                <span className="text-slate-805 font-bold">Starter Plan</span>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-250 text-emerald-600 text-[10px] font-bold rounded-md">
                  Active
                </span>
              </div>
              
              <ul className="space-y-2 text-slate-500">
                <li className="flex items-center gap-2 text-[11px]">
                  <span className="text-blue-600 font-bold">✓</span>
                  10,000 messages / month
                </li>
                <li className="flex items-center gap-2 text-[11px]">
                  <span className="text-blue-600 font-bold">✓</span>
                  1 team member
                </li>
                <li className="flex items-center gap-2 text-[11px]">
                  <span className="text-blue-600 font-bold">✓</span>
                  1 connected account
                </li>
              </ul>

              <Link 
                to="/billing"
                className="w-full mt-3 py-2.5 rounded-xl border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center transition-colors bg-white shadow-sm"
              >
                View Billing & Usage
              </Link>
            </div>
          </div>

          {/* Organization ID Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Organization ID</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Use this ID for API and integrations.</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value="org_8f3a7b2d6c1e4a9b"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono text-[10px] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyOrgId}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-655 rounded-xl flex items-center justify-center bg-white shadow-sm relative"
                title="Copy ID"
              >
                {copiedId ? (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 text-white rounded text-[8px] uppercase tracking-wider animate-bounce shadow">
                    Copied
                  </span>
                ) : null}
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Delete Organization Danger Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 font-outfit">Delete Organization</h3>
              <p className="text-[10px] text-slate-450 mt-0.5 leading-normal">
                Once you delete your organization, there is no going back. Please be certain.
              </p>
            </div>

            <button
              type="button"
              className="w-full py-2.5 rounded-xl border border-rose-250 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete Organization
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
