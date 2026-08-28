import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services';
import { MessageSquare, CheckCircle } from 'lucide-react';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  VerifyOtpForm,
  ResetPasswordForm,
} from '../components/auth';

type AuthView = 'login' | 'register' | 'forgot' | 'verify-otp' | 'reset-password';

export const Auth: React.FC = () => {
  const { login, signup } = useApp();
  const [view, setView] = useState<AuthView>('login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleViewChange = (newView: AuthView) => {
    setView(newView);
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      if (view === 'login') {
        await login(email, password);
      } else if (view === 'register') {
        await signup(email, name, password);
        setSuccessMessage('Verification code sent to your email.');
        setView('verify-otp');
      } else if (view === 'forgot') {
        const res = await api.passwordResetRequest(email);
        setSuccessMessage(res?.message || 'Password reset OTP sent to your email.');
        setView('reset-password');
      }
    } catch (err: any) {
      if (err.is_verified === false) {
        setSuccessMessage('Please verify your email address. We sent an OTP to your inbox.');
        setView('verify-otp');
      } else {
        setError(err.error || err.detail || 'An unexpected error occurred. Please try again.');
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
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onSubmit={handleSubmit}
              onGoogleLogin={handleGoogleLogin}
              onSwitchView={handleViewChange}
            />
          )}

          {view === 'register' && (
            <RegisterForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onSubmit={handleSubmit}
              onSwitchToLogin={() => handleViewChange('login')}
            />
          )}

          {view === 'forgot' && (
            <ForgotPasswordForm
              email={email}
              setEmail={setEmail}
              loading={loading}
              onSubmit={handleSubmit}
              onSwitchToLogin={() => handleViewChange('login')}
            />
          )}

          {view === 'verify-otp' && (
            <VerifyOtpForm
              email={email}
              setEmail={setEmail}
              otp={otp}
              setOtp={setOtp}
              loading={loading}
              onSubmit={handleVerifyOtp}
              onSwitchToLogin={() => handleViewChange('login')}
            />
          )}

          {view === 'reset-password' && (
            <ResetPasswordForm
              email={email}
              setEmail={setEmail}
              otp={otp}
              setOtp={setOtp}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmNewPassword={confirmNewPassword}
              setConfirmNewPassword={setConfirmNewPassword}
              loading={loading}
              onSubmit={handleResetPasswordConfirm}
              onSwitchToLogin={() => handleViewChange('login')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
