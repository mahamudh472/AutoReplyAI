import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { GoogleIcon } from '../components/SocialIcons';

export const Auth: React.FC = () => {
  const { login, signup } = useApp();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
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
        await login(email);
      } else if (view === 'register') {
        await signup(email, name);
      } else {
        // Forgot password simulation
        setTimeout(() => {
          setResetSent(true);
          setLoading(false);
        }, 1000);
        return;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      if (view !== 'forgot') {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('google.user@gmail.com', 'Google User');
    } catch {
      setError('Google Authentication failed.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-outfit">
            AutoReply<span className="text-purple-400">AI</span>
          </span>
        </div>

        {/* Auth Glass Card */}
        <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl relative">
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {view === 'login' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Welcome back</h2>
              <p className="text-slate-400 text-sm mb-6">Sign in to manage your customer automated channels</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setError(''); }}
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
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
                      className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none glow-primary"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0b0f1e] px-2 text-slate-400">Or continue with</span></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white font-medium flex items-center justify-center gap-2"
              >
                <GoogleIcon className="h-5 w-5" />
                Google Authentication
              </button>

              <p className="text-center text-slate-400 text-sm mt-8">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setView('register'); setError(''); }}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Create one
                </button>
              </p>
            </div>
          )}

          {view === 'register' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Create account</h2>
              <p className="text-slate-400 text-sm mb-6">Build your business AI automated support manager</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none glow-primary"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <p className="text-center text-slate-400 text-sm mt-8">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setView('login'); setError(''); }}
                  className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}

          {view === 'forgot' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Forgot Password?</h2>
              <p className="text-slate-400 text-sm mb-6">Enter your email and we'll send a password recovery code</p>

              {resetSent ? (
                <div className="text-center space-y-4 py-6">
                  <div className="h-12 w-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Reset Link Sent</h3>
                  <p className="text-slate-400 text-sm">
                    We've emailed instructions to <span className="text-white">{email}</span>. Check your inbox and spam folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setView('login'); setResetSent(false); setEmail(''); }}
                    className="text-purple-400 hover:text-purple-300 font-medium mt-4 block mx-auto transition-colors"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 active:scale-[0.98] disabled:opacity-50"
                  >
                    {loading ? 'Sending link...' : 'Send Recovery Link'}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setView('login'); setError(''); }}
                    className="w-full text-center text-slate-400 text-sm hover:text-slate-300 py-2 transition-colors block mt-2"
                  >
                    Back to Login
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
