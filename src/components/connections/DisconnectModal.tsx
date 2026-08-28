import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DisconnectModalProps {
  platform: 'fb' | 'ig' | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export const DisconnectModal: React.FC<DisconnectModalProps> = ({
  platform,
  onCancel,
  onConfirm,
}) => {
  if (!platform) return null;

  const isFacebook = platform === 'fb';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md mx-4 space-y-5 animate-slide-in z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
            <AlertTriangle className="h-5.5 w-5.5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-850 font-outfit">
              Disconnect {isFacebook ? 'Facebook Page' : 'Instagram Profile'}?
            </h3>
            <p className="text-[10px] text-slate-400">
              This action will immediately stop AI automated responses on this channel.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed pl-1">
          Are you sure you want to disconnect? All active conversations, sync parameters, and AI auto-replies for this{' '}
          {isFacebook ? 'Facebook Page' : 'Instagram Profile'} will be paused.
        </p>

        <div className="flex gap-3 justify-end pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors shadow-md shadow-rose-500/10"
          >
            Disconnect Account
          </button>
        </div>
      </div>
    </div>
  );
};
