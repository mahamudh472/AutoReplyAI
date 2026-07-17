import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MetaConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform?: 'facebook' | 'instagram';
}

export const MetaConnectModal: React.FC<MetaConnectModalProps> = ({
  isOpen,
  onClose,
  platform = 'facebook'
}) => {
  const { 
    getFacebookAuthUrl, 
    fetchFacebookPages, 
    linkFacebookPage,
    connectMetaPage 
  } = useApp();

  const [step, setStep] = useState<'init' | 'auth' | 'select' | 'activating' | 'success'>('init');
  const [pages, setPages] = useState<{ id: string; name: string }[]>([]);
  const [selectedPageId, setSelectedPageId] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPagesFromBackend = useCallback(async () => {
    setStep('select');
    setErrorMsg(null);
    try {
      const fetchedPages = await fetchFacebookPages();
      setPages(fetchedPages);
      if (fetchedPages.length > 0) {
        setSelectedPageId(fetchedPages[0].id);
      } else {
        setErrorMsg('No pages found. Make sure you are an administrator of at least one page.');
      }
    } catch {
      setErrorMsg('Failed to fetch Facebook pages from the backend.');
    }
  }, [fetchFacebookPages]);

  // Check for success URL parameters if the backend redirected directly
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get('success') === 'true' || window.location.hash.includes('success=true');
      if (isSuccess) {
        // Load pages straight away
        loadPagesFromBackend();
      }
    }
  }, [isOpen, loadPagesFromBackend]);

  const startOAuthFlow = async () => {
    setErrorMsg(null);
    setStep('auth');
    try {
      const authUrl = await getFacebookAuthUrl();
      
      const width = 600;
      const height = 680;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        authUrl,
        'FacebookOAuthPopup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
      );

      if (!popup) {
        setErrorMsg('Popup blocker detected. Please allow popups for this site and click the button to retry.');
        setStep('init');
        return;
      }

      // Popup opened successfully

      // Listen for popup messages (simulation or advanced popup integration)
      const handlePopupMessage = async (event: MessageEvent) => {
        if (event.data.type === 'FB_AUTH_SUCCESS') {
          window.removeEventListener('message', handlePopupMessage);
          
          const approvedPages = event.data.pages;
          setPages(approvedPages);
          if (approvedPages.length > 0) {
            setSelectedPageId(approvedPages[0].id);
          }
          setStep('select');
        } else if (event.data.type === 'FB_AUTH_CANCEL') {
          window.removeEventListener('message', handlePopupMessage);
          setStep('init');
        }
      };

      window.addEventListener('message', handlePopupMessage);

      // Watch if window closes
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          // Wait briefly in case a success message comes in, then return to init if still in auth step
          setTimeout(() => {
            setStep(current => {
              if (current === 'auth') {
                // If it closed and we didn't receive message, try to call backend pages fetch in case of a redirect
                loadPagesFromBackend();
                return 'select';
              }
              return current;
            });
          }, 1500);
        }
      }, 1000);

    } catch {
      setErrorMsg('Failed to start Facebook connection flow.');
      setStep('init');
    }
  };

  const handleLinkPage = async () => {
    if (!selectedPageId) return;
    setStep('activating');
    setErrorMsg(null);

    const selectedPage = pages.find(p => p.id === selectedPageId);
    if (!selectedPage) {
      setErrorMsg('Selected page details not found.');
      setStep('select');
      return;
    }

    try {
      await linkFacebookPage(selectedPageId);
      
      // Update local application connections state
      await connectMetaPage(platform, selectedPageId, selectedPage.name);

      setStep('success');
      
      // Fire confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      setErrorMsg('Failed to link the selected page. Please try again.');
      setStep('select');
    }
  };

  const handleRetryPopup = () => {
    startOAuthFlow();
  };

  const handleClose = () => {
    setStep('init');
    setPages([]);
    setSelectedPageId('');
    setErrorMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
        onClick={handleClose}
      ></div>

      {/* Modal Box */}
      <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-lg mx-4 space-y-6 animate-slide-in overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-60"></div>

        {/* Modal Header */}
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl flex items-center justify-center shadow-sm ${
              platform === 'facebook' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-500'
            }`}>
              {platform === 'facebook' ? <FacebookIcon className="h-6 w-6" /> : <InstagramIcon className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 font-outfit flex items-center gap-1.5">
                Connect {platform === 'facebook' ? 'Facebook Page' : 'Instagram Profile'}
                {step === 'success' && <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />}
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {step === 'init' && 'Link your Business channel to enable AI auto-replies.'}
                {step === 'auth' && 'Complete login details.'}
                {step === 'select' && 'Select the page to active.'}
                {step === 'activating' && 'Syncing parameters...'}
                {step === 'success' && 'Connection successfully established.'}
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex gap-2.5 text-[10px] leading-relaxed text-rose-700">
            <AlertTriangle className="h-4.5 w-4.5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">An error occurred:</span> {errorMsg}
            </div>
          </div>
        )}

        {/* STEP 1: INITIALIZE */}
        {step === 'init' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-650" />
                Integration Permissions & Security
              </h4>
              <ul className="text-xs text-slate-600 space-y-2.5 pl-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold text-sm leading-none">•</span>
                  <span>Retrieve Page customer comments and inbox messages in real-time.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold text-sm leading-none">•</span>
                  <span>Generate replies automatically or draft responses based on your AI model configuration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold text-sm leading-none">•</span>
                  <span>Subscribe to Meta webhook updates to maintain instant, zero-delay responses.</span>
                </li>
              </ul>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={handleClose}
                className="px-4.5 py-2.5 border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={startOAuthFlow}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition-all cursor-pointer hover:shadow-blue-500/20"
              >
                Connect with Facebook <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: WAITING FOR AUTH (POPUP ACTIVE) */}
        {step === 'auth' && (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-xs font-bold text-slate-800">Waiting for Facebook Authorization</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Please complete the Facebook login process in the popup window. If it did not open or is blocked, click below.
              </p>
            </div>
            <button
              onClick={handleRetryPopup}
              className="mt-2 px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl text-[10px] transition-colors cursor-pointer"
            >
              Open Facebook Window Again
            </button>
          </div>
        )}

        {/* STEP 3: PAGE SELECTION */}
        {step === 'select' && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Page to Link
              </label>
              
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 max-h-[180px] overflow-y-auto">
                {pages.map(page => {
                  const isChecked = selectedPageId === page.id;
                  return (
                    <div 
                      key={page.id}
                      onClick={() => setSelectedPageId(page.id)}
                      className={`flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                        isChecked ? 'bg-blue-50/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                          {page.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{page.name}</p>
                          <p className="text-[9px] text-slate-400">ID: {page.id}</p>
                        </div>
                      </div>
                      
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'border-slate-300 bg-white'
                      }`}>
                        {isChecked && <div className="h-1.5 w-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setStep('init')}
                className="px-4.5 py-2.5 border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleLinkPage}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 flex items-center gap-1.5 transition-all cursor-pointer"
                disabled={!selectedPageId}
              >
                Link Page & Activate
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ACTIVATING WEBHOCKS / SPINNING */}
        {step === 'activating' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-650 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-blue-600 uppercase font-outfit">Sync</span>
              </div>
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h4 className="text-xs font-bold text-slate-800 animate-pulse">Activating Connected Integration</h4>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Verifying permissions, requesting page token upgrades and linking webhooks for instant auto-replies.
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS */}
        {step === 'success' && (
          <div className="space-y-6">
            <div className="py-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner relative">
                <CheckCircle2 className="h-10 w-10 animate-scale-up" />
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 text-[8px] animate-bounce">
                  ✨
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-800">Connection Complete!</h4>
                <p className="text-[10px] text-slate-400">
                  {platform === 'facebook' ? 'Facebook Page' : 'Instagram Profile'} is now linked and active.
                </p>
              </div>

              <div className="w-full max-w-xs mt-2 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm">
                  {pages.find(p => p.id === selectedPageId)?.name.charAt(0) || 'P'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">
                    {pages.find(p => p.id === selectedPageId)?.name || 'Linked Channel'}
                  </h5>
                  <p className="text-[9px] text-slate-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active Syncing Enabled
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 transition-all cursor-pointer"
              >
                Finish Setup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
