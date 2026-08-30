import React, { useState, useEffect, useRef } from 'react';
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
  Store,
  Loader2,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Organization: React.FC = () => {
  const { 
    organizations, 
    activeOrgId, 
    activeOrg,
    orgSubscription, 
    isOrgLoading, 
    isOrgSaving,
    selectOrg,
    createOrg,
    updateOrgSettings, 
    uploadOrgLogo,
    removeOrgLogo,
    deleteOrg
  } = useApp();

  const org = activeOrg || organizations.find(o => o.id === activeOrgId) || organizations[0] || {
    id: '',
    name: '',
    slug: '',
    logo: '',
    timezone: 'GMT+06:00',
    language: 'English',
    description: ''
  };

  // Form states
  const [name, setName] = useState(org.name || '');
  const [slug, setSlug] = useState(org.slug || '');
  const [logo, setLogo] = useState(org.logo_url || org.logo || '');
  const [timezone, setTimezone] = useState(org.timezone || 'GMT+06:00');
  const [language, setLanguage] = useState(org.default_language || org.language || 'English');
  const [description, setDescription] = useState(org.description || '');

  // UI state
  const [saved, setSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Modals
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync form when active org changes
  useEffect(() => {
    if (org) {
      setName(org.name || '');
      setSlug(org.slug || (org.name ? org.name.toLowerCase().replace(/\s+/g, '-') : ''));
      setLogo(org.logo_url || org.logo || '');
      setTimezone(org.timezone || 'GMT+06:00');
      setLanguage(org.default_language || org.language || 'English');
      setDescription(org.description || '');
    }
  }, [org.id, org.name, org.slug, org.logo_url, org.logo, org.timezone, org.language, org.default_language, org.description]);

  const handleCopyOrgId = () => {
    if (org.id) {
      navigator.clipboard.writeText(org.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setErrorMsg('Image size must be less than 2MB.');
      return;
    }

    try {
      setIsUploadingLogo(true);
      setErrorMsg(null);
      const newLogoUrl = await uploadOrgLogo(file);
      if (newLogoUrl) {
        setLogo(newLogoUrl);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to upload logo.');
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = async () => {
    try {
      setIsUploadingLogo(true);
      setErrorMsg(null);
      await removeOrgLogo();
      setLogo('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to remove logo.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await updateOrgSettings({
        name,
        slug,
        default_language: language,
        timezone,
        description
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: any) {
      if (err?.details) {
        const firstErrorKey = Object.keys(err.details)[0];
        setErrorMsg(`${firstErrorKey}: ${err.details[firstErrorKey]}`);
      } else {
        setErrorMsg(err?.message || 'Failed to update organization settings.');
      }
    }
  };

  const handleDeleteOrg = async () => {
    if (deleteConfirmText.trim() !== org.name.trim()) {
      setErrorMsg('Please type the exact organization name to confirm deletion.');
      return;
    }
    try {
      await deleteOrg(org.id);
      setDeleteModalOpen(false);
      setDeleteConfirmText('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to delete organization.');
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    try {
      await createOrg({
        name: newOrgName.trim(),
        slug: newOrgSlug.trim() || newOrgName.trim().toLowerCase().replace(/\s+/g, '-'),
        default_language: 'English',
        timezone: 'GMT+06:00'
      });
      setCreateModalOpen(false);
      setNewOrgName('');
      setNewOrgSlug('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create organization.');
    }
  };

  const planFeatures = orgSubscription?.features || {
    max_messages: 10000,
    used_messages: 0,
    max_team_members: 1,
    used_team_members: 1,
    max_connected_accounts: 1,
    used_connected_accounts: 0,
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-750">
      
      {/* Hidden File Input for Logo */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleLogoFileChange} 
        accept="image/png,image/jpeg,image/svg+xml" 
        className="hidden" 
      />

      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">Organization</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your organization details and preferences.</p>
        </div>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-2.5">
          {/* Org Selector Switcher */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {logo ? (
                <img src={logo} alt={org.name} className="h-4 w-4 rounded object-cover" />
              ) : (
                <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">
                  {org.name ? org.name.charAt(0).toUpperCase() : 'O'}
                </span>
              )}
              <span className="max-w-[140px] truncate">{org.name || 'Select Organization'}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {orgDropdownOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setOrgDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-40 p-1.5 animate-fade-in">
                  <div className="px-2 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Your Organizations
                  </div>
                  {organizations.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => {
                        selectOrg(o.id);
                        setOrgDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs cursor-pointer transition-colors ${
                        o.id === org.id
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {o.logo_url || o.logo ? (
                          <img src={o.logo_url || o.logo} alt={o.name} className="h-4.5 w-4.5 rounded object-cover" />
                        ) : (
                          <span className="h-4.5 w-4.5 bg-blue-600/10 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold">
                            {o.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        <span className="truncate">{o.name}</span>
                      </div>
                      {o.role && (
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">
                          {o.role}
                        </span>
                      )}
                    </button>
                  ))}

                  <div className="border-t border-slate-100 my-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setOrgDropdownOpen(false);
                        setCreateModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs text-blue-600 hover:bg-blue-50 font-semibold cursor-pointer transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Organization
                    </button>
                  </div>
                </div>
              </>
            )}
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

      {/* Error / Alert Banner */}
      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-700 font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-500 hover:text-rose-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-805 font-outfit">Organization Information</h3>
              <p className="text-xs text-slate-400 mt-0.5">Update your organization's basic information.</p>
            </div>
            {isOrgLoading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
          </div>

          {/* Logo Upload Slot */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400">Logo</label>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-blue-50/70 border border-slate-200 flex items-center justify-center text-blue-600 flex-shrink-0 overflow-hidden relative">
                {isUploadingLogo ? (
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                ) : logo ? (
                  <img src={logo} alt="Organization Logo" className="h-full w-full object-cover" />
                ) : (
                  <Store className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    disabled={isUploadingLogo}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 border border-slate-250 hover:bg-slate-50 text-blue-600 hover:text-blue-700 font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingLogo ? 'Uploading...' : 'Change Logo'}
                  </button>
                  {logo && (
                    <button 
                      type="button" 
                      disabled={isUploadingLogo}
                      onClick={handleRemoveLogo}
                      className="px-3 py-1.5 text-rose-600 hover:text-rose-700 font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      Remove
                    </button>
                  )}
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
              placeholder="e.g. ABC Store"
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
              placeholder="e.g. abc-store"
              required
            />
            <p className="text-[10px] text-slate-400">This will be used in your organization URL and API identifier.</p>
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
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
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
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-750 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm cursor-pointer"
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
              disabled={isOrgSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isOrgSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Saving...
                </>
              ) : saved ? (
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
                <span className="text-slate-805 font-bold">{orgSubscription?.plan_name || 'Starter Plan'}</span>
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-250 text-emerald-600 text-[10px] font-bold rounded-md capitalize">
                  {orgSubscription?.status || 'Active'}
                </span>
              </div>
              
              <ul className="space-y-2 text-slate-500">
                <li className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-blue-600 font-bold">✓</span>
                    Messages / month:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {planFeatures.used_messages.toLocaleString()} / {planFeatures.max_messages.toLocaleString()}
                  </span>
                </li>
                <li className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-blue-600 font-bold">✓</span>
                    Team members:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {planFeatures.used_team_members} / {planFeatures.max_team_members}
                  </span>
                </li>
                <li className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="text-blue-600 font-bold">✓</span>
                    Connected accounts:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {planFeatures.used_connected_accounts} / {planFeatures.max_connected_accounts}
                  </span>
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
                value={org.id || 'Loading...'}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono text-[10px] focus:outline-none select-all"
              />
              <button
                type="button"
                onClick={handleCopyOrgId}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-655 rounded-xl flex items-center justify-center bg-white shadow-sm relative cursor-pointer"
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
              onClick={() => setDeleteModalOpen(true)}
              className="w-full py-2.5 rounded-xl border border-rose-250 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
              Delete Organization
            </button>
          </div>

        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-outfit">Delete Organization</h3>
                  <p className="text-xs text-slate-500">This action cannot be undone.</p>
                </div>
              </div>
              <button 
                onClick={() => { setDeleteModalOpen(false); setDeleteConfirmText(''); }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-800">{org.name}</strong>? All connected pages, AI prompt configurations, knowledge documents, and history will be lost.
            </p>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-500">
                Type <span className="text-slate-800 select-all font-mono">{org.name}</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={org.name}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setDeleteModalOpen(false); setDeleteConfirmText(''); }}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmText.trim() !== org.name.trim()}
                onClick={handleDeleteOrg}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-600/10 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Organization Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <form onSubmit={handleCreateOrg} className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 font-outfit">Create Organization</h3>
                  <p className="text-xs text-slate-500">Set up a new workspace for your business.</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-500">Organization Name</label>
              <input
                type="text"
                required
                value={newOrgName}
                onChange={(e) => {
                  setNewOrgName(e.target.value);
                  if (!newOrgSlug) {
                    setNewOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g. Acme Agency"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-500">Organization Slug</label>
              <input
                type="text"
                value={newOrgSlug}
                onChange={(e) => setNewOrgSlug(e.target.value)}
                placeholder="e.g. acme-agency"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/10 cursor-pointer"
              >
                Create Organization
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
