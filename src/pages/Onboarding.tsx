import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building, ShieldCheck, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';
import confetti from 'canvas-confetti';

export const Onboarding: React.FC = () => {
  const { createOrg, toggleConnection, updateUser } = useApp();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  
  // Platform connections
  const [fbConnected, setFbConnected] = useState(false);
  const [igConnected, setIgConnected] = useState(false);
  const [fbPageName, setFbPageName] = useState('My Brand Online');
  const [igHandle, setIgHandle] = useState('@mybrand_official');
  
  // AI Settings
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiMode, setAiMode] = useState<'Automatic' | 'Draft Only'>('Automatic');

  const handleNext = () => {
    if (step === 1 && !businessName.trim()) return;
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleFinish = () => {
    // 1. Create organization
    createOrg(businessName, logoUrl);
    
    // 2. Setup connections in state
    if (fbConnected) {
      toggleConnection('facebook', fbPageName);
    }
    if (igConnected) {
      toggleConnection('instagram', igHandle);
    }
    
    // 3. Mark user onboarding completed
    updateUser({ onboardingCompleted: true });

    // 4. Confetti burst!
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#a78bfa', '#818cf8', '#6366f1', '#10b981']
    });
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-2xl z-10">
        
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2">
            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border ${step >= 1 ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/10 text-slate-400'}`}>1</span>
            <span className="text-sm font-medium text-slate-300">Business details</span>
          </div>
          <div className="flex-1 h-[2px] bg-white/10 mx-4">
            <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border ${step >= 2 ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/10 text-slate-400'}`}>2</span>
            <span className="text-sm font-medium text-slate-300">Connect Meta</span>
          </div>
          <div className="flex-1 h-[2px] bg-white/10 mx-4">
            <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300" style={{ width: step === 3 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border ${step >= 3 ? 'bg-purple-600 border-purple-500 text-white' : 'border-white/10 text-slate-400'}`}>3</span>
            <span className="text-sm font-medium text-slate-300">AI Automation</span>
          </div>
        </div>

        {/* Step Cards */}
        <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl relative">
          
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-outfit">Tell us about your business</h2>
                <p className="text-slate-400 text-sm mt-1">Let's set up your business organization profile.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Business / Organization Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. ABC Store"
                      className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Logo URL (Optional)</label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full pl-10 pr-4 py-3 glass-input text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!businessName.trim()}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none glow-primary text-sm"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-outfit">Connect your social channels</h2>
                <p className="text-slate-400 text-sm mt-1">Connect your Facebook Pages and Instagram accounts to automate.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Facebook Integration Block */}
                <div className={`p-5 rounded-2xl border transition-all ${fbConnected ? 'bg-purple-950/20 border-purple-500/40' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
                      <FacebookIcon className="h-6 w-6" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setFbConnected(!fbConnected)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${fbConnected ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-white/10 text-white hover:bg-white/25'}`}
                    >
                      {fbConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <h3 className="text-white font-semibold text-sm">Facebook Messenger</h3>
                  <p className="text-slate-400 text-xs mt-1 mb-4">Automate page replies and Messenger responses.</p>
                  
                  {fbConnected && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Select Facebook Page</label>
                      <input
                        type="text"
                        value={fbPageName}
                        onChange={(e) => setFbPageName(e.target.value)}
                        placeholder="Page Name"
                        className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Instagram Integration Block */}
                <div className={`p-5 rounded-2xl border transition-all ${igConnected ? 'bg-purple-950/20 border-purple-500/40' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-pink-600/20 rounded-xl text-pink-400">
                      <InstagramIcon className="h-6 w-6" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIgConnected(!igConnected)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${igConnected ? 'bg-purple-600 text-white hover:bg-purple-500' : 'bg-white/10 text-white hover:bg-white/25'}`}
                    >
                      {igConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <h3 className="text-white font-semibold text-sm">Instagram DMs</h3>
                  <p className="text-slate-400 text-xs mt-1 mb-4">Automate Instagram direct message replies.</p>

                  {igConnected && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Instagram Username</label>
                      <input
                        type="text"
                        value={igHandle}
                        onChange={(e) => setIgHandle(e.target.value)}
                        placeholder="@username"
                        className="w-full px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 border border-white/10 text-slate-400 hover:text-white rounded-xl transition-colors flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 active:scale-95 glow-primary text-sm"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white font-outfit">Setup AI Automations</h2>
                <p className="text-slate-400 text-sm mt-1">Decide how you want our smart assistant to respond to customer texts.</p>
              </div>

              <div className="space-y-4">
                {/* AI Enable Toggle */}
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <div>
                    <h3 className="text-white font-semibold text-sm">Enable AI Engine</h3>
                    <p className="text-slate-400 text-xs mt-1">Let the AI start processing conversations immediately.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiEnabled}
                      onChange={(e) => setAiEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-focus:ring-2 peer-focus:ring-purple-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {/* AI Reply Modes */}
                {aiEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <div
                      onClick={() => setAiMode('Automatic')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${aiMode === 'Automatic' ? 'bg-purple-950/20 border-purple-500/60 ring-1 ring-purple-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        Automatic Mode
                      </h4>
                      <p className="text-slate-400 text-xs mt-2">
                        AI drafts and replies immediately on Meta channels based on your knowledge base.
                      </p>
                    </div>

                    <div
                      onClick={() => setAiMode('Draft Only')}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${aiMode === 'Draft Only' ? 'bg-purple-950/20 border-purple-500/60 ring-1 ring-purple-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                    >
                      <h4 className="text-white font-semibold text-sm flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-purple-400" />
                        Draft & Review Mode
                      </h4>
                      <p className="text-slate-400 text-xs mt-2">
                        AI drafts a response, but it waits for your review and approval before hitting send.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-3 border border-white/10 text-slate-400 hover:text-white rounded-xl transition-colors flex items-center gap-2 text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 active:scale-95 glow-primary text-sm"
                >
                  <Sparkles className="h-4 w-4" />
                  Finish Setup
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
