import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { GoogleIcon } from '../SocialIcons';

interface LoginFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogleLogin: () => void;
  onSwitchView: (view: 'register' | 'forgot') => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  onSubmit,
  onGoogleLogin,
  onSwitchView,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Welcome back</h2>
      <p className="text-slate-500 text-sm mb-6">Sign in to manage your customer automated channels</p>

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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Password
            </label>
            <button
              type="button"
              onClick={() => onSwitchView('forgot')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
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
          {loading ? 'Signing in...' : 'Sign In'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onGoogleLogin}
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl border border-slate-250 bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium flex items-center justify-center gap-2 shadow-sm cursor-pointer"
      >
        <GoogleIcon className="h-5 w-5" />
        Google Authentication
      </button>

      <p className="text-center text-slate-500 text-sm mt-8">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => onSwitchView('register')}
          className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
        >
          Create one
        </button>
      </p>
    </div>
  );
};
