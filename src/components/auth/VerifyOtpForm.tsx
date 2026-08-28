import React from 'react';
import { Mail, ShieldCheck, ArrowRight } from 'lucide-react';

interface VerifyOtpFormProps {
  email: string;
  setEmail: (val: string) => void;
  otp: string;
  setOtp: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

export const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({
  email,
  setEmail,
  otp,
  setOtp,
  loading,
  onSubmit,
  onSwitchToLogin,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Verify Email</h2>
      <p className="text-slate-500 text-sm mb-6">
        Enter the 6-digit OTP code sent to your email to verify your address.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            OTP Code
          </label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full pl-10 pr-4 py-3 glass-input text-slate-800 placeholder-slate-400 text-sm font-semibold tracking-widest text-center focus:outline-none"
              maxLength={6}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-50 glow-primary cursor-pointer"
        >
          {loading ? 'Verifying OTP...' : 'Verify & Activate'}
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="w-full text-center text-slate-500 text-sm hover:text-slate-700 py-2 transition-colors block mt-2 cursor-pointer font-semibold"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};
