import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  RefreshCw, 
  MoreVertical, 
  HelpCircle, 
  Bell, 
  Info,
  Copy,
  AlertTriangle,
  Settings,
  Trash2
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';
import { MetaConnectModal } from '../components/settings/MetaConnectModal';

export const Connections: React.FC = () => {
  const { connections, disconnectMetaPage } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Connection Modal & Interactive States
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [metaModalPlatform, setMetaModalPlatform] = useState<'facebook' | 'instagram'>('facebook');
  const [activeDropdown, setActiveDropdown] = useState<'fb' | 'ig' | null>(null);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState<'fb' | 'ig' | null>(null);
  const [syncingPlatform, setSyncingPlatform] = useState<'fb' | 'ig' | null>(null);

  const fbConn = connections.find(c => c.platform === 'facebook');
  const igConn = connections.find(c => c.platform === 'instagram');

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSync = (platform: 'fb' | 'ig') => {
    setSyncingPlatform(platform);
    setActiveDropdown(null);
    setTimeout(() => {
      setSyncingPlatform(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-700">
      
      {/* 1. Header with Page title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">Connections</h1>
          <p className="text-xs text-slate-400 mt-1">Connect and manage your social media accounts</p>
        </div>

        {/* Header Right Widgets */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm flex items-center gap-1.5">
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">A</span>
            <span>ABC Store</span>
            <MoreVertical className="h-3 w-3 text-slate-400 rotate-90" />
          </div>

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          
          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors">
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 border border-white"></span>
          </button>
        </div>
      </div>

      {/* 2. Connected Accounts Card Console */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Connected Accounts</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage your connected Meta accounts</p>
          </div>
          
          <button 
            onClick={() => { setMetaModalPlatform('facebook'); setIsMetaModalOpen(true); }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <span className="text-sm font-light">+</span> Connect Meta Account
          </button>
        </div>

        {/* Active connection rows */}
        <div className="space-y-4">
          
          {/* Row 1: Facebook Page Link */}
          {fbConn?.connected && (
            <div className="border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-[240px]">
                <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm shadow-blue-500/10">
                  <FacebookIcon className="h-6 w-6" />
                </div>
                <div className="truncate space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">
                      {fbConn.pageName || 'Facebook Page'}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide">
                      Facebook Page
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    @{fbConn.pageName?.toLowerCase().replace(/\s+/g, '') || 'fbpage'}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>Page ID: {fbConn.pageId}</span>
                    <button 
                      onClick={() => handleCopy(fbConn.pageId || '', 'fb')}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {copiedId === 'fb' && (
                      <span className="text-emerald-500 font-semibold text-[8px] uppercase">Copied!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Account properties columns */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-xs text-slate-655 flex-1 min-w-[320px]">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status</p>
                  <p className="text-emerald-650 font-bold">Connected</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Webhook</p>
                  <p className="text-emerald-650 font-bold flex items-center gap-1">
                    Active
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  </p>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Sync Status</p>
                  <p className="font-semibold text-slate-700 flex items-center gap-1">
                    {syncingPlatform === 'fb' ? (
                      <>
                        <RefreshCw className="h-3 w-3 text-blue-600 animate-spin" />
                        <span className="text-blue-600 font-bold">Syncing...</span>
                      </>
                    ) : (
                      <>
                        {fbConn.lastSync || 'Synced 5m ago'}
                        <RefreshCw 
                          onClick={() => handleSync('fb')}
                          className="h-3 w-3 text-slate-400 hover:text-slate-650 cursor-pointer" 
                        />
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Permissions</p>
                  <p className="font-semibold text-slate-700 flex items-center gap-1">
                    15 permissions
                    <Info className="h-3 w-3 text-slate-400" />
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Connected On</p>
                  <p className="font-semibold text-slate-700">May 20, 2024</p>
                </div>
              </div>

              <div className="relative flex-shrink-0 flex items-center gap-2 self-end lg:self-center">
                <button 
                  onClick={() => setActiveDropdown(prev => prev === 'fb' ? null : 'fb')}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {activeDropdown === 'fb' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                    <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-44 z-20 animate-fade-in text-xs font-semibold">
                      <button 
                        onClick={() => handleSync('fb')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-slate-450" />
                        Sync Now
                      </button>
                      <button 
                        onClick={() => { setMetaModalPlatform('facebook'); setIsMetaModalOpen(true); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
                      >
                        <Settings className="h-3.5 w-3.5 text-slate-450" />
                        Manage Settings
                      </button>
                      <hr className="my-1.5 border-slate-100" />
                      <button 
                        onClick={() => { setShowConfirmDisconnect('fb'); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-left cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        Disconnect Page
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Row 2: Instagram Account Link */}
          {igConn?.connected && (
            <div className="border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
              <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-[240px]">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                  <InstagramIcon className="h-6 w-6 text-white" />
                </div>
                <div className="truncate space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-800 leading-tight">
                      {igConn.pageName || 'Instagram Profile'}
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-600 text-[10px] font-bold uppercase tracking-wide">
                      Instagram
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    @{igConn.pageName?.toLowerCase().replace(/\s+/g, '') || 'igprofile'}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>Instagram Business ID: {igConn.pageId}</span>
                    <button 
                      onClick={() => handleCopy(igConn.pageId || '', 'ig')}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    {copiedId === 'ig' && (
                      <span className="text-emerald-500 font-semibold text-[8px] uppercase">Copied!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Account properties columns */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-xs text-slate-655 flex-1 min-w-[320px]">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Status</p>
                  <p className="text-emerald-650 font-bold">Connected</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Webhook</p>
                  <p className="text-emerald-650 font-bold flex items-center gap-1">
                    Active
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  </p>
                </div>

                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Sync Status</p>
                  <p className="font-semibold text-slate-700 flex items-center gap-1">
                    {syncingPlatform === 'ig' ? (
                      <>
                        <RefreshCw className="h-3 w-3 text-pink-600 animate-spin" />
                        <span className="text-pink-600 font-bold">Syncing...</span>
                      </>
                    ) : (
                      <>
                        {igConn.lastSync || 'Synced 1m ago'}
                        <RefreshCw 
                          onClick={() => handleSync('ig')}
                          className="h-3 w-3 text-slate-400 hover:text-slate-650 cursor-pointer" 
                        />
                      </>
                    )}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Permissions</p>
                  <p className="font-semibold text-slate-700 flex items-center gap-1">
                    12 permissions
                    <Info className="h-3 w-3 text-slate-400" />
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Connected On</p>
                  <p className="font-semibold text-slate-700">May 20, 2024</p>
                </div>
              </div>

              <div className="relative flex-shrink-0 flex items-center gap-2 self-end lg:self-center">
                <button 
                  onClick={() => setActiveDropdown(prev => prev === 'ig' ? null : 'ig')}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {activeDropdown === 'ig' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)}></div>
                    <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-44 z-20 animate-fade-in text-xs font-semibold">
                      <button 
                        onClick={() => handleSync('ig')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
                      >
                        <RefreshCw className="h-3.5 w-3.5 text-slate-450" />
                        Sync Now
                      </button>
                      <button 
                        onClick={() => { setMetaModalPlatform('instagram'); setIsMetaModalOpen(true); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
                      >
                        <Settings className="h-3.5 w-3.5 text-slate-450" />
                        Manage Settings
                      </button>
                      <hr className="my-1.5 border-slate-100" />
                      <button 
                        onClick={() => { setShowConfirmDisconnect('ig'); setActiveDropdown(null); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-left cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                        Disconnect Profile
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 3. Available Connections Deck */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-805 font-outfit">Available Connections</h3>
          <p className="text-xs text-slate-400 mt-0.5">Connect more platforms to manage all your messages in one place</p>
        </div>

        {/* Card Deck Grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          
          {/* Card 1: Meta Facebook Page */}
          <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                  ∞
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                  (fbConn?.connected || igConn?.connected)
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200'
                }`}>
                  {(fbConn?.connected || igConn?.connected) ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              
              <h4 className="text-xs font-bold text-slate-800 mt-4">Meta</h4>
              <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
                Connect Facebook Pages, Instagram Business accounts and Messenger.
              </p>
            </div>
            
            <button 
              onClick={() => { setMetaModalPlatform('facebook'); setIsMetaModalOpen(true); }}
              className="w-full mt-6 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {(fbConn?.connected || igConn?.connected) ? 'Manage' : 'Connect'}
            </button>
          </div>

          {/* Card 2: WhatsApp Business */}
          <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg font-bold">
                  ☏
                </div>
                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
              
              <h4 className="text-xs font-bold text-slate-800 mt-4">WhatsApp Business</h4>
              <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
                Connect your WhatsApp Business account to automate replies.
              </p>
            </div>
            
            <button className="w-full mt-6 py-2 border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              Notify me
            </button>
          </div>

          {/* Card 3: Telegram Channels */}
          <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center text-lg font-bold">
                  ✈
                </div>
                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
              
              <h4 className="text-xs font-bold text-slate-800 mt-4">Telegram</h4>
              <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
                Connect your Telegram account to manage messages.
              </p>
            </div>
            
            <button className="w-full mt-6 py-2 border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              Notify me
            </button>
          </div>

          {/* Card 4: TikTok Business */}
          <div className="p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:border-slate-305 transition-colors">
            <div>
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center text-md font-bold">
                  ♪
                </div>
                <span className="text-[8px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
              
              <h4 className="text-xs font-bold text-slate-805 mt-4">TikTok</h4>
              <p className="text-[11px] text-slate-450 mt-1.5 leading-normal">
                Connect your TikTok Business account to manage messages.
              </p>
            </div>
            
            <button className="w-full mt-6 py-2 border border-blue-600/30 hover:bg-blue-50 text-blue-600 font-semibold text-xs rounded-xl transition-colors">
              Notify me
            </button>
          </div>

          {/* Nav Right Slider circle button */}
          <button className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-slate-500 hover:bg-slate-50 z-10">
            &gt;
          </button>
        </div>
      </div>

      {/* 4. Timeline workflow chart */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
        <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-6 font-outfit">
          <Info className="h-4.5 w-4.5 text-blue-650" />
          How Meta Connection Works
        </h4>

        {/* Steps deck flex layout */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Step 1 */}
          <div className="flex items-start gap-4 flex-1">
            <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
              1
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-800">1. Connect</h5>
              <p className="text-[11px] text-slate-450 leading-relaxed">Connect your Meta account and grant required permissions.</p>
            </div>
          </div>

          {/* Arrow */}
          <span className="hidden md:block text-slate-350 text-lg flex-shrink-0 px-2">→</span>

          {/* Step 2 */}
          <div className="flex items-start gap-4 flex-1">
            <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
              2
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-800">2. Webhook Setup</h5>
              <p className="text-[11px] text-slate-450 leading-relaxed">We'll set up webhooks to receive messages in real-time.</p>
            </div>
          </div>

          {/* Arrow */}
          <span className="hidden md:block text-slate-350 text-lg flex-shrink-0 px-2">→</span>

          {/* Step 3 */}
          <div className="flex items-start gap-4 flex-1">
            <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
              3
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-slate-800">3. Sync & Ready</h5>
              <p className="text-[11px] text-slate-450 leading-relaxed">Start managing conversations and enable AI replies.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disconnect Confirmation Dialog */}
      {showConfirmDisconnect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowConfirmDisconnect(null)}></div>
          <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md mx-4 space-y-5 animate-slide-in z-10">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
                <AlertTriangle className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-850 font-outfit">
                  Disconnect {showConfirmDisconnect === 'fb' ? 'Facebook Page' : 'Instagram Profile'}?
                </h3>
                <p className="text-[10px] text-slate-400">
                  This action will immediately stop AI automated responses on this channel.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pl-1">
              Are you sure you want to disconnect? All active conversations, sync parameters, and AI auto-replies for this {showConfirmDisconnect === 'fb' ? 'Facebook Page' : 'Instagram Profile'} will be paused.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowConfirmDisconnect(null)}
                className="px-4 py-2 border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const target = showConfirmDisconnect === 'fb' ? 'facebook' : 'instagram';
                  await disconnectMetaPage(target);
                  setShowConfirmDisconnect(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-md shadow-rose-500/10"
              >
                Disconnect Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meta Connection Modal */}
      <MetaConnectModal
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        platform={metaModalPlatform}
      />

    </div>
  );
};
