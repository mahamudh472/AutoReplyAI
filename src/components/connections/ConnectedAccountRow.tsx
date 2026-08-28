import React, { useState } from 'react';
import { Copy, RefreshCw, Info, MoreVertical, Settings, Trash2 } from 'lucide-react';
import type { Connection } from '../../types/connections';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';

interface ConnectedAccountRowProps {
  connection: Connection;
  syncing: boolean;
  onSync: () => void;
  onManage: () => void;
  onDisconnectRequest: () => void;
}

export const ConnectedAccountRow: React.FC<ConnectedAccountRowProps> = ({
  connection,
  syncing,
  onSync,
  onManage,
  onDisconnectRequest,
}) => {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isFacebook = connection.platform === 'facebook';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-4 overflow-hidden flex-1 min-w-[240px]">
        <div
          className={`h-12 w-12 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-sm ${
            isFacebook
              ? 'bg-blue-600 shadow-blue-500/10'
              : 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600'
          }`}
        >
          {isFacebook ? <FacebookIcon className="h-6 w-6" /> : <InstagramIcon className="h-6 w-6 text-white" />}
        </div>
        <div className="truncate space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-800 leading-tight">
              {connection.pageName || (isFacebook ? 'Facebook Page' : 'Instagram Profile')}
            </h4>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                isFacebook ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'
              }`}
            >
              {isFacebook ? 'Facebook Page' : 'Instagram'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            @{connection.pageName?.toLowerCase().replace(/\s+/g, '') || (isFacebook ? 'fbpage' : 'igprofile')}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>
              {isFacebook ? 'Page ID' : 'Instagram Business ID'}: {connection.pageId}
            </span>
            <button
              onClick={() => handleCopy(connection.pageId || '')}
              className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
            >
              <Copy className="h-3 w-3" />
            </button>
            {copied && <span className="text-emerald-500 font-semibold text-[8px] uppercase">Copied!</span>}
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
            {syncing ? (
              <>
                <RefreshCw
                  className={`h-3 w-3 animate-spin ${isFacebook ? 'text-blue-600' : 'text-pink-600'}`}
                />
                <span className={`font-bold ${isFacebook ? 'text-blue-600' : 'text-pink-600'}`}>Syncing...</span>
              </>
            ) : (
              <>
                {connection.lastSync || 'Synced 5m ago'}
                <RefreshCw
                  onClick={onSync}
                  className="h-3 w-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                />
              </>
            )}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Permissions</p>
          <p className="font-semibold text-slate-700 flex items-center gap-1">
            {isFacebook ? '15 permissions' : '12 permissions'}
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
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
            <div className="absolute right-0 top-11 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 w-44 z-20 animate-fade-in text-xs font-semibold">
              <button
                onClick={() => {
                  onSync();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5 text-slate-450" />
                Sync Now
              </button>
              <button
                onClick={() => {
                  onManage();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left cursor-pointer"
              >
                <Settings className="h-3.5 w-3.5 text-slate-450" />
                Manage Settings
              </button>
              <hr className="my-1.5 border-slate-100" />
              <button
                onClick={() => {
                  onDisconnectRequest();
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-left cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                Disconnect {isFacebook ? 'Page' : 'Profile'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
