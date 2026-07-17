import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, MessageSquare, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { GoogleIcon } from '../components/SocialIcons';
import { api } from '../utils/api';

export const Auth: React.FC = () => {
  const { login, signup } = useApp();
  const [view, setView] = useState<'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP and New Password states
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleViewChange = (newView: 'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password') => {
    setView(newView);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (view !== 'forgot' && !password) {
      setError('Password is required');
      return;
    }

    if (view === 'register' && !name) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
      if (view === 'login') {
        await login(email, password);
      } else if (view === 'register') {
        await signup(email, name, password);
        setSuccessMessage('Account created! Verification OTP sent to your email.');
        setView('verify-otp');
      } else if (view === 'forgot') {
        await api.passwordReset(email);
        setSuccessMessage('Password reset OTP code sent to your email.');
        setView('reset-password');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      const isUnverified = 
        err.code === 'EMAIL_NOT_VERIFIED' || 
        (Array.isArray(err.code) && err.code.includes('EMAIL_NOT_VERIFIED')) ||
        (err.detail && (
          err.detail === 'Account is not active. An OTP has been sent to your email for verification.' ||
          (Array.isArray(err.detail) && err.detail[0]?.includes('not active'))
        ));

      if (isUnverified && view === 'login') {
        setError('');
        setSuccessMessage('Email not verified. An OTP code has been sent to your email.');
        setView('verify-otp');
      } else {
        setError(err.error || err.detail || (Array.isArray(err.detail) ? err.detail[0] : null) || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otp) {
      setError('OTP code is required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyEmail(email, otp);
      setSuccessMessage(res.message || 'Email successfully verified! You can now log in.');
      setView('login');
      setOtp('');
      setPassword('');
    } catch (err: any) {
      setError(err.error || err.detail || 'Invalid OTP code or it has expired.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!otp) {
      setError('OTP code is required');
      return;
    }

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await api.passwordResetConfirm(email, otp, newPassword);
      setSuccessMessage(res.message || 'Password successfully reset! You can now log in.');
      setView('login');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPassword('');
    } catch (err: any) {
      setError(err.error || err.detail || 'Could not reset password. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      await login('google.user@gmail.com', 'Google User');
    } catch {
      setError('Google Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 font-outfit">
            AutoReply<span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Auth White Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl relative">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {view === 'login' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Welcome back</h2>
              <p className="text-slate-500 text-sm mb-6">Sign in to manage your customer automated channels</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
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
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => handleViewChange('forgot')}
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
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">Or continue with</span></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
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
                  onClick={() => handleViewChange('register')}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {view === 'register' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Create account</h2>
              <p className="text-slate-500 text-sm mb-6">Build your business AI automated support manager</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
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
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
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
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
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
                  onClick={() => handleViewChange('login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {view === 'forgot' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Forgot Password?</h2>
              <p className="text-slate-500 text-sm mb-6">Enter your email and we'll send a password recovery code</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending code...' : 'Send Recovery OTP'}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleViewChange('login')}
                  className="w-full text-center text-slate-500 text-sm hover:text-slate-700 py-2 transition-colors block mt-2 cursor-pointer font-semibold"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}

          {view === 'verify-otp' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Verify Email</h2>
              <p className="text-slate-500 text-sm mb-6">Enter the 6-digit OTP code sent to your email to verify your address.</p>

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
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
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">OTP Code</label>
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
                  onClick={() => handleViewChange('login')}
                  className="w-full text-center text-slate-500 text-sm hover:text-slate-700 py-2 transition-colors block mt-2 cursor-pointer font-semibold"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}

          {view === 'reset-password' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Reset Password</h2>
              <p className="text-slate-500 text-sm mb-6">Enter the OTP sent to your email and your new secure password.</p>

              <form onSubmit={handleResetPasswordConfirm} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
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
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">OTP Code</label>
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

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-4 py-3 glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-3 glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-50 glow-primary cursor-pointer"
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleViewChange('login')}
                  className="w-full text-center text-slate-500 text-sm hover:text-slate-700 py-2 transition-colors block mt-2 cursor-pointer font-semibold"
                >
                  Back to Login
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
