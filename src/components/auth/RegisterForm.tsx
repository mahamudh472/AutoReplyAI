import React from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';

interface RegisterFormProps {
  name: string;
  setName: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onSwitchToLogin,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Create account</h2>
      <p className="text-slate-500 text-sm mb-6">Build your business AI automated support manager</p>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Your Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full pl-10 pr-4 py-3 glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
              required
            />
          </div>
        </div>

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
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none glow-primary cursor-pointer"
        >
          {loading ? 'Creating account...' : 'Create Account'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="text-center text-slate-500 text-sm mt-8">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
