import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Globe, Clock, ChevronDown, Check, Sun, Moon, Monitor } from 'lucide-react';

export const ProfileTab: React.FC = () => {
  const { user, updateUser } = useApp();

  const [name, setName] = useState(user?.name || 'Mahmudul Hasan');
  const [email, setEmail] = useState(user?.email || 'mahmudul@example.com');
  const [phone, setPhone] = useState('+880 17 1234 5678');
  const [language, setLanguage] = useState('English (US)');
  const [timezone, setTimezone] = useState('(GMT+06:00) Dhaka, Bangladesh');

  // Preferences
  const [defaultDashboard, setDefaultDashboard] = useState('Conversations');
  const [dateFormat, setDateFormat] = useState('May 20, 2024 (MM DD, YYYY)');

  // Interface Toggles
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [compactMode, setCompactMode] = useState(false);
  const [collapsedSidebar, setCollapsedSidebar] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Profile Information Form */}
        <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Profile Information</h3>
            <p className="text-xs text-slate-400 mt-0.5">Update your personal information and how others see you.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo Upload Side */}
            <div className="flex flex-col items-center gap-3 w-full md:w-1/4">
              <label className="block text-[10px] uppercase font-bold text-slate-400 self-start">Profile Photo</label>
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"} 
                alt={name} 
                className="h-24 w-24 rounded-full object-cover border border-slate-200/60 shadow-sm"
              />
              
              <div className="flex gap-2.5 mt-1">
                <button 
                  type="button" 
                  className="px-2.5 py-1.5 border border-slate-250 hover:bg-slate-50 text-blue-600 hover:text-blue-700 font-semibold text-[10px] rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Change Photo
                </button>
                <button 
                  type="button" 
                  className="px-2.5 py-1.5 text-rose-600 hover:text-rose-700 font-semibold text-[10px] transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </div>
              <p className="text-[9px] text-slate-400 text-center leading-normal">JPG, PNG or WEBP. Max size 2MB.</p>
            </div>

            {/* Form Inputs Side */}
            <div className="flex-1 space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
                  required
                />
              </div>

              {/* Phone Number (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Phone Number (Optional)</label>
                <div className="flex gap-2">
                  <div className="px-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-1 shadow-sm text-xs font-semibold select-none cursor-pointer">
                    <span>🇧🇩</span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
                  />
                </div>
              </div>

              {/* Language Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Language</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full pl-9.5 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="Spanish (Español)">Spanish (Español)</option>
                    <option value="German (Deutsch)">German (Deutsch)</option>
                    <option value="French (Français)">French (Français)</option>
                  </select>
                </div>
              </div>

              {/* Timezone Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Timezone</label>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full pl-9.5 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-750 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
                  >
                    <option value="(GMT+06:00) Dhaka, Bangladesh">(GMT+06:00) Dhaka, Bangladesh</option>
                    <option value="(GMT-08:00) Pacific Time (US & Canada)">(GMT-08:00) Pacific Time (US & Canada)</option>
                    <option value="(GMT-05:00) Eastern Time (US & Canada)">(GMT-05:00) Eastern Time (US & Canada)</option>
                    <option value="(GMT+00:00) London, United Kingdom">(GMT+00:00) London, United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button Row */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              {saved ? (
                <>
                  <Check className="h-4 w-4" />
                  Changes Saved
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>

        {/* Preferences Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit font-medium">Preferences</h3>
            <p className="text-xs text-slate-400 mt-0.5">Customize your experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Default Dashboard */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Default Dashboard</label>
              <select
                value={defaultDashboard}
                onChange={(e) => setDefaultDashboard(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="Conversations">Conversations</option>
                <option value="Dashboard">Dashboard Overview</option>
                <option value="Connections">Connections Panel</option>
              </select>
              <p className="text-[9px] text-slate-400 leading-normal">Choose which dashboard you want to see first.</p>
            </div>

            {/* Date Format */}
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="May 20, 2024 (MM DD, YYYY)">May 20, 2024 (MM DD, YYYY)</option>
                <option value="20/05/2024 (DD/MM/YYYY)">20/05/2024 (DD/MM/YYYY)</option>
                <option value="2024-05-20 (YYYY-MM-DD)">2024-05-20 (YYYY-MM-DD)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (1/3 width) */}
      <div className="space-y-6">
        {/* Interface Preferences Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Interface Preferences</h3>
            <p className="text-[10px] text-slate-405 mt-0.5">Customize how the application looks and feels.</p>
          </div>

          {/* Theme Selector */}
          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Theme</label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* Light button */}
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-3.5 border rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  theme === 'light' 
                    ? 'border-blue-600 bg-blue-50/10 text-blue-600 ring-1 ring-blue-500/10' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-405'
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>

              {/* Dark button */}
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-3.5 border rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  theme === 'dark' 
                    ? 'border-blue-600 bg-blue-50/10 text-blue-600 ring-1 ring-blue-500/10' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-405'
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>

              {/* System button */}
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`py-3.5 border rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-bold cursor-pointer ${
                  theme === 'system' 
                    ? 'border-blue-600 bg-blue-50/10 text-blue-600 ring-1 ring-blue-500/10' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-405'
                }`}
              >
                <Monitor className="h-4 w-4" />
                System
              </button>

            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start justify-between">
              <div className="max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-805 leading-normal">Compact mode</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Show more content in less space.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={(e) => setCompactMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-start justify-between">
              <div className="max-w-[80%]">
                <h4 className="text-xs font-bold text-slate-805 leading-normal">Left sidebar collapsed by default</h4>
                <p className="text-[9px] text-slate-400 mt-0.5 leading-normal">Start with a collapsed sidebar.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-0.5">
                <input
                  type="checkbox"
                  checked={collapsedSidebar}
                  onChange={(e) => setCollapsedSidebar(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
