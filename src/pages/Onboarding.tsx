import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Building, Loader2, ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';
import confetti from 'canvas-confetti';

export const Onboarding: React.FC = () => {
  const {
    createOrg,
    selectOrg,
    updateOrgSettings,
    uploadOrgLogo,
    refreshOrganizations,
    toggleConnection,
    updateUser,
    isOrgSaving,
  } = useApp();
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState('');

  const [fbConnected, setFbConnected] = useState(false);
  const [igConnected, setIgConnected] = useState(false);
  const [fbPageName, setFbPageName] = useState('My Brand Online');
  const [igHandle, setIgHandle] = useState('@mybrand_official');

  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiMode, setAiMode] = useState<'Automatic' | 'Draft Only'>('Automatic');

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview('');
      return;
    }
    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [logoFile]);

  const handleNext = () => {
    if (step === 1 && !businessName.trim()) return;
    setStep((previous) => previous + 1);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && file.size > 2 * 1024 * 1024) {
      setError('Logo size must be less than 2MB.');
      event.target.value = '';
      return;
    }
    setError('');
    setLogoFile(file);
  };

  const handleFinish = async () => {
    if (!businessName.trim() || isFinishing) return;
    setIsFinishing(true);
    setError('');

    try {
      const currentOrganizations = await refreshOrganizations();
      const ownedOrganization =
        currentOrganizations.find((organization) => organization.role === 'owner') ||
        currentOrganizations[0];

      let organizationId: string;
      if (ownedOrganization) {
        organizationId = ownedOrganization.id;
        selectOrg(organizationId);
        await updateOrgSettings(
          {
            name: businessName.trim(),
            default_language: ownedOrganization.default_language || ownedOrganization.language || 'English',
            timezone: ownedOrganization.timezone || 'GMT+06:00',
          },
          organizationId
        );
      } else {
        organizationId = await createOrg({
          name: businessName.trim(),
          default_language: 'English',
          timezone: 'GMT+06:00',
        });
      }

      if (logoFile) {
        await uploadOrgLogo(logoFile, organizationId);
      }

      if (fbConnected) {
        toggleConnection('facebook', fbPageName);
      }
      if (igConnected) {
        toggleConnection('instagram', igHandle);
      }

      await updateUser({ onboardingCompleted: true });
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#6366f1', '#10b981', '#a78bfa'],
      });
    } catch (err: any) {
      setError(err?.error || err?.detail || err?.message || 'Setup could not be completed. Please try again.');
    } finally {
      setIsFinishing(false);
    }
  };

  const isBusy = isFinishing || isOrgSaving;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-purple-600/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-2xl z-10">
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2">
            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border ${step >= 1 ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-200 text-slate-400 bg-white'}`}>1</span>
            <span className={`text-sm font-semibold ${step >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>Business details</span>
          </div>
          <div className="flex-1 h-[2px] bg-slate-200 mx-4">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border ${step >= 2 ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-200 text-slate-400 bg-white'}`}>2</span>
            <span className={`text-sm font-semibold ${step >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>Connect Meta</span>
          </div>
          <div className="flex-1 h-[2px] bg-slate-200 mx-4">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" style={{ width: step === 3 ? '100%' : '0%' }}></div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border ${step >= 3 ? 'bg-blue-600 border-blue-500 text-white' : 'border-slate-200 text-slate-400 bg-white'}`}>3</span>
            <span className={`text-sm font-semibold ${step >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>AI Automation</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xl relative">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Tell us about your business</h2>
                <p className="text-slate-500 text-sm mt-1">Let's set up your business organization profile.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Business / Organization Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-450" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(event) => setBusinessName(event.target.value)}
                      placeholder="e.g. ABC Store"
                      className="w-full pl-10 pr-4 py-3 glass-input text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Logo (Optional)</label>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden text-slate-400">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Organization logo preview" className="h-full w-full object-cover" />
                      ) : (
                        <Upload className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <label className="inline-block px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-blue-600 text-xs font-semibold rounded-xl cursor-pointer">
                        Choose image
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/svg+xml,image/webp"
                          onChange={handleLogoChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-2">PNG, JPG, SVG or WEBP. Maximum 2MB.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!businessName.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none glow-primary text-sm cursor-pointer"
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
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Connect your social channels</h2>
                <p className="text-slate-500 text-sm mt-1">Connect your Facebook Pages and Instagram accounts to automate.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border transition-all ${fbConnected ? 'bg-blue-50/10 border-blue-500/30 ring-1 ring-blue-500/10' : 'bg-slate-50/50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600"><FacebookIcon className="h-6 w-6" /></div>
                    <button type="button" onClick={() => setFbConnected(!fbConnected)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer border ${fbConnected ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                      {fbConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <h3 className="text-slate-800 font-bold text-sm">Facebook Messenger</h3>
                  <p className="text-slate-500 text-xs mt-1 mb-4 leading-normal">Automate page replies and Messenger responses.</p>
                  {fbConnected && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Select Facebook Page</label>
                      <input type="text" value={fbPageName} onChange={(event) => setFbPageName(event.target.value)} placeholder="Page Name" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500" />
                    </div>
                  )}
                </div>

                <div className={`p-5 rounded-2xl border transition-all ${igConnected ? 'bg-blue-50/10 border-blue-500/30 ring-1 ring-blue-500/10' : 'bg-slate-50/50 border-slate-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-pink-600/10 rounded-xl text-pink-600"><InstagramIcon className="h-6 w-6" /></div>
                    <button type="button" onClick={() => setIgConnected(!igConnected)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer border ${igConnected ? 'bg-pink-600 text-white border-pink-500 hover:bg-pink-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}>
                      {igConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                  <h3 className="text-slate-800 font-bold text-sm">Instagram DMs</h3>
                  <p className="text-slate-500 text-xs mt-1 mb-4 leading-normal">Automate Instagram direct message replies.</p>
                  {igConnected && (
                    <div className="space-y-2 animate-fade-in">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Instagram Username</label>
                      <input type="text" value={igHandle} onChange={(event) => setIgHandle(event.target.value)} placeholder="@username" className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-blue-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setStep((previous) => previous - 1)} className="px-5 py-3 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl transition-colors flex items-center gap-2 text-sm cursor-pointer">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center gap-2 active:scale-95 glow-primary text-sm cursor-pointer">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 font-outfit">Setup AI Automations</h2>
                <p className="text-slate-500 text-sm mt-1">Decide how you want our smart assistant to respond to customer texts.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-200 rounded-2xl">
                  <div>
                    <h3 className="text-slate-800 font-bold text-sm">Enable AI Engine</h3>
                    <p className="text-slate-500 text-xs mt-1">Let the AI start processing conversations immediately.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={aiEnabled} onChange={(event) => setAiEnabled(event.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {aiEnabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                    <div onClick={() => setAiMode('Automatic')} className={`p-5 rounded-2xl border cursor-pointer transition-all ${aiMode === 'Automatic' ? 'bg-blue-50/10 border-blue-500/40 ring-1 ring-blue-500/20' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50'}`}>
                      <h4 className="text-slate-800 font-bold text-sm flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-600" />Automatic Mode</h4>
                      <p className="text-slate-500 text-xs mt-2 leading-relaxed">AI drafts and replies immediately on Meta channels based on your knowledge base.</p>
                    </div>
                    <div onClick={() => setAiMode('Draft Only')} className={`p-5 rounded-2xl border cursor-pointer transition-all ${aiMode === 'Draft Only' ? 'bg-blue-50/10 border-blue-500/40 ring-1 ring-blue-500/20' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/50'}`}>
                      <h4 className="text-slate-800 font-bold text-sm flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-600" />Draft & Review Mode</h4>
                      <p className="text-slate-500 text-xs mt-2 leading-relaxed">AI drafts a response, but it waits for your review and approval before hitting send.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button type="button" disabled={isBusy} onClick={() => setStep((previous) => previous - 1)} className="px-5 py-3 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 rounded-xl transition-colors flex items-center gap-2 text-sm cursor-pointer disabled:opacity-50">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" disabled={isBusy} onClick={handleFinish} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 active:scale-95 glow-primary text-sm cursor-pointer disabled:opacity-60 disabled:pointer-events-none">
                  {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isBusy ? 'Saving setup...' : 'Finish Setup'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
