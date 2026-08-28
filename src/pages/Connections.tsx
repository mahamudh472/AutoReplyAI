import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, Bell, MoreVertical } from 'lucide-react';
import { MetaConnectModal } from '../components/settings/MetaConnectModal';
import {
  ConnectedAccountRow,
  AvailableConnectionsDeck,
  ConnectionWorkflowGuide,
  DisconnectModal,
} from '../components/connections';

export const Connections: React.FC = () => {
  const { connections, disconnectMetaPage } = useApp();

  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [metaModalPlatform, setMetaModalPlatform] = useState<'facebook' | 'instagram'>('facebook');
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState<'fb' | 'ig' | null>(null);
  const [syncingPlatform, setSyncingPlatform] = useState<'fb' | 'ig' | null>(null);

  const fbConn = connections.find((c) => c.platform === 'facebook');
  const igConn = connections.find((c) => c.platform === 'instagram');

  const handleSync = (platform: 'fb' | 'ig') => {
    setSyncingPlatform(platform);
    setTimeout(() => {
      setSyncingPlatform(null);
    }, 1500);
  };

  const handleManage = (platform: 'facebook' | 'instagram') => {
    setMetaModalPlatform(platform);
    setIsMetaModalOpen(true);
  };

  const handleDisconnectConfirm = async () => {
    if (!showConfirmDisconnect) return;
    const target = showConfirmDisconnect === 'fb' ? 'facebook' : 'instagram';
    await disconnectMetaPage(target);
    setShowConfirmDisconnect(null);
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
            <span className="h-4 w-4 bg-blue-600 rounded text-white flex items-center justify-center text-[9px] font-bold">
              A
            </span>
            <span>ABC Store</span>
            <MoreVertical className="h-3 w-3 text-slate-400 rotate-90" />
          </div>

          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
            <HelpCircle className="h-4.5 w-4.5" />
          </button>

          <button className="relative p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-655 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer">
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
            onClick={() => {
              setMetaModalPlatform('facebook');
              setIsMetaModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            <span className="text-sm font-light">+</span> Connect Meta Account
          </button>
        </div>

        {/* Active connection rows */}
        <div className="space-y-4">
          {fbConn?.connected && (
            <ConnectedAccountRow
              connection={fbConn}
              syncing={syncingPlatform === 'fb'}
              onSync={() => handleSync('fb')}
              onManage={() => handleManage('facebook')}
              onDisconnectRequest={() => setShowConfirmDisconnect('fb')}
            />
          )}

          {igConn?.connected && (
            <ConnectedAccountRow
              connection={igConn}
              syncing={syncingPlatform === 'ig'}
              onSync={() => handleSync('ig')}
              onManage={() => handleManage('instagram')}
              onDisconnectRequest={() => setShowConfirmDisconnect('ig')}
            />
          )}
        </div>
      </div>

      {/* 3. Available Connections Deck */}
      <AvailableConnectionsDeck
        hasMetaConnected={Boolean(fbConn?.connected || igConn?.connected)}
        onOpenMetaModal={() => {
          setMetaModalPlatform('facebook');
          setIsMetaModalOpen(true);
        }}
      />

      {/* 4. Timeline workflow chart */}
      <ConnectionWorkflowGuide />

      {/* Disconnect Confirmation Dialog */}
      <DisconnectModal
        platform={showConfirmDisconnect}
        onCancel={() => setShowConfirmDisconnect(null)}
        onConfirm={handleDisconnectConfirm}
      />

      {/* Meta Connection Modal */}
      <MetaConnectModal
        isOpen={isMetaModalOpen}
        onClose={() => setIsMetaModalOpen(false)}
        platform={metaModalPlatform}
      />
    </div>
  );
};
