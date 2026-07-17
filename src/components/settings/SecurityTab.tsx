import React, { useState } from 'react';
import { Lock, Shield, CheckCircle, AlertCircle, Smartphone, Laptop, Monitor } from 'lucide-react';
import { TwoFactorModal } from './TwoFactorModal';
import { api } from '../../utils/api';

export const SecurityTab: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);

  // Active Sessions State
  const [sessions, setSessions] = useState([
    { id: 'sess-1', device: 'Chrome on Linux (Ubuntu)', location: 'Dhaka, Bangladesh', time: 'Active now (Current)', isCurrent: true, ip: '103.118.45.10' },
    { id: 'sess-2', device: 'Safari on iPhone 15 Pro', location: 'London, United Kingdom', time: '2 hours ago', isCurrent: false, ip: '188.42.12.98' },
    { id: 'sess-3', device: 'Firefox on Windows 11', location: 'San Francisco, USA', time: '3 days ago', isCurrent: false, ip: '74.125.19.147' },
  ]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordStatus({ type: 'error', message: 'Current password is required.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and Confirm Password do not match.' });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'Password must be at least 8 characters long.' });
      return;
    }
    
    try {
      const res = await api.changePassword(currentPassword, newPassword, confirmPassword);
      setPasswordStatus({ type: 'success', message: res.message || 'Your password has been successfully updated!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordStatus(null), 4000);
    } catch (err: any) {
      setPasswordStatus({
        type: 'error',
        message: err.error || err.detail || (Array.isArray(err.detail) ? err.detail[0] : null) || 'Failed to update password.'
      });
    }
  };

  const handleRevokeSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Password Change Card */}
        <form onSubmit={handleChangePassword} className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Update Password</h3>
            <p className="text-xs text-slate-400 mt-0.5">Ensure your account is using a long, secure password.</p>
          </div>

          {passwordStatus && (
            <div className={`p-4 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              passwordStatus.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-200/60' 
                : 'bg-rose-50 text-rose-700 border-rose-200/60'
            }`}>
              {passwordStatus.type === 'success' ? <CheckCircle className="h-4.5 w-4.5 text-green-600" /> : <AlertCircle className="h-4.5 w-4.5 text-rose-600" />}
              <span>{passwordStatus.message}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 text-xs flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              Update Password
            </button>
          </div>
        </form>

        {/* Active Sessions Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Active Logged-In Sessions</h3>
            <p className="text-xs text-slate-400 mt-0.5">Devices currently holding active session tokens for your account.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {sessions.map((sess) => (
              <div key={sess.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-500">
                    {sess.device.includes('iPhone') ? <Smartphone className="h-5 w-5" /> : sess.device.includes('Windows') ? <Laptop className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-850 flex items-center gap-1.5">
                      {sess.device}
                      {sess.isCurrent && (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[9px] font-bold rounded-md border border-green-200/50">Current</span>
                      )}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{sess.location} • IP: {sess.ip} • {sess.time}</p>
                  </div>
                </div>

                {!sess.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(sess.id)}
                    className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 text-[10px] font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column (1/3 width) */}
      <div className="space-y-6">
        
        {/* Two-Factor Authentication Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-805 font-outfit">Two-Factor Auth</h3>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Add an extra layer of protection to your account by requiring an authenticator code at sign in.
          </p>

          <div className="flex items-center justify-between py-2 border-t border-b border-slate-100">
            <span className="text-xs text-slate-500 font-medium">Status</span>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
              twoFactorEnabled 
                ? 'bg-green-50 text-green-700 border-green-200/50' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          {twoFactorEnabled ? (
            <button
              type="button"
              onClick={() => setTwoFactorEnabled(false)}
              className="w-full py-2.5 rounded-xl border border-rose-250 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Disable 2FA Security
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShow2FAModal(true)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Configure 2FA
            </button>
          )}
        </div>

      </div>

      {/* 2FA Modal Integration */}
      <TwoFactorModal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        onSuccess={() => {
          setTwoFactorEnabled(true);
          setShow2FAModal(false);
        }}
      />
    </div>
  );
};
