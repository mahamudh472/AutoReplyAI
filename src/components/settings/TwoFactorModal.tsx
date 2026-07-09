import React, { useState } from 'react';
import { Shield, AlertTriangle, QrCode } from 'lucide-react';

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');

  if (!isOpen) return null;

  const handleEnable2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFactorCode.length !== 6 || isNaN(Number(twoFactorCode))) {
      setTwoFactorError('Please enter a valid 6-digit numeric verification code.');
      return;
    }
    setTwoFactorError('');
    setTwoFactorCode('');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md mx-4 space-y-5 animate-slide-in">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Shield className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 font-outfit">Setup Two-Factor Auth</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Secure your login process.</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {twoFactorError && (
          <div className="p-3 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-xl border border-rose-250/30 flex items-center gap-1.5 animate-fade-in">
            <AlertTriangle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            <span>{twoFactorError}</span>
          </div>
        )}

        <form onSubmit={handleEnable2FA} className="space-y-4">
          <div className="flex flex-col items-center gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <div className="p-3 bg-white rounded-xl border border-slate-200/60 shadow-sm">
              <QrCode className="h-28 w-28 text-slate-800" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Secret Key</p>
              <code className="text-xs font-bold text-slate-700 font-mono">4A2E 9X2J 81LA K93B</code>
            </div>
            <p className="text-[9px] text-slate-450 text-center leading-normal">
              Scan the QR code with Google Authenticator or Microsoft Authenticator, then enter the 6-digit verification code below.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] uppercase font-bold text-slate-405">Verification Code</label>
            <input
              type="text"
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              placeholder="e.g. 123456"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-center text-sm font-bold tracking-widest text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm"
              required
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Verify & Enable
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
