import React, { useState } from 'react';
import { FacebookIcon } from '../components/SocialIcons';
import { Shield, Check, Info, Lock } from 'lucide-react';

export const MockFacebookOAuth: React.FC = () => {
  const [selectedPages, setSelectedPages] = useState<string[]>(['fb-page-101']); // Default selected
  const [authorizing, setAuthorizing] = useState(false);

  const availablePages = [
    { id: 'fb-page-101', name: 'ABC Store Online', category: 'Retail & E-commerce', likes: '1.2k likes' },
    { id: 'fb-page-202', name: "Mahmud's Tech Corner", category: 'Personal Blog', likes: '840 likes' },
    { id: 'fb-page-303', name: 'Global Fashion Co', category: 'Apparel Brand', likes: '4.5k likes' },
    { id: 'fb-page-404', name: 'Sweet Delights Bakery', category: 'Local Business', likes: '310 likes' },
  ];

  const handleTogglePage = (id: string) => {
    setSelectedPages(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPages.length === availablePages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(availablePages.map(p => p.id));
    }
  };

  const handleAuthorize = () => {
    if (selectedPages.length === 0) {
      alert('Please select at least one page to link.');
      return;
    }

    setAuthorizing(true);
    
    // Simulate Facebook token processing latency
    setTimeout(() => {
      const chosenPages = availablePages.filter(p => selectedPages.includes(p.id));
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'FB_AUTH_SUCCESS',
            pages: chosenPages,
          },
          '*'
        );
        window.close();
      } else {
        // Fallback for debugging if loaded outside popup
        alert('Authorization Successful! Selected pages: ' + chosenPages.map(p => p.name).join(', '));
        setAuthorizing(false);
      }
    }, 1200);
  };

  const handleCancel = () => {
    if (window.opener) {
      window.opener.postMessage({ type: 'FB_AUTH_CANCEL' }, '*');
      window.close();
    } else {
      alert('Authorization Cancelled.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-between text-slate-700 font-sans p-4">
      {/* Top Banner */}
      <div className="w-full max-w-xl bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden mt-6 flex-grow flex flex-col">
        {/* Facebook Header */}
        <div className="bg-[#1877F2] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FacebookIcon className="h-6 w-6 fill-current" />
            <span className="font-semibold tracking-wide text-sm font-outfit">Facebook Login</span>
          </div>
          <span className="text-[10px] text-blue-100 flex items-center gap-1">
            <Lock className="h-3 w-3" /> Secure Connection
          </span>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
          
          {/* Header Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-blue-600 text-lg shadow-sm">
                AR
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800">AutoReply AI is requesting access</h2>
                <p className="text-[11px] text-slate-450 mt-0.5">
                  Select which Facebook Business Pages you want to connect to your workspace.
                </p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-2.5 text-[10px] leading-relaxed text-blue-800">
              <Shield className="h-4.5 w-4.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Privacy Disclosure:</span> AutoReply AI will only be able to view and manage customer messages and comments on the pages you select below. We will never post on your personal profile or access personal data.
              </div>
            </div>
          </div>

          {/* Pages Selection List */}
          <div className="space-y-3 flex-grow">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Your Pages ({availablePages.length})</h3>
              <button 
                onClick={handleSelectAll} 
                className="text-[10px] font-bold text-[#1877F2] hover:underline cursor-pointer"
              >
                {selectedPages.length === availablePages.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-[220px] overflow-y-auto bg-slate-50/40">
              {availablePages.map(page => {
                const isChecked = selectedPages.includes(page.id);
                return (
                  <div 
                    key={page.id}
                    onClick={() => handleTogglePage(page.id)}
                    className={`flex items-center justify-between p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                      isChecked ? 'bg-blue-50/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                        {page.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">{page.name}</p>
                        <p className="text-[10px] text-slate-400 leading-normal">{page.category} • {page.likes}</p>
                      </div>
                    </div>
                    
                    <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                      isChecked 
                        ? 'bg-[#1877F2] border-[#1877F2] text-white shadow-sm shadow-blue-500/20' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Requested Scopes list */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl space-y-2">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Info className="h-3.5 w-3.5 text-slate-400" />
              Permissions Requested
            </h4>
            <ul className="text-[10px] text-slate-450 space-y-1 pl-4 list-disc leading-normal">
              <li>Manage your Business Pages (`pages_manage_metadata`)</li>
              <li>Read customer messages and chat logs (`pages_messaging`)</li>
              <li>Analyze Page contents and comments (`pages_read_engagement`)</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              disabled={authorizing}
            >
              Cancel
            </button>
            <button
              onClick={handleAuthorize}
              className="px-6 py-2.5 bg-[#1877F2] hover:bg-[#1565C0] text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              disabled={authorizing}
            >
              {authorizing ? (
                <>
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authorizing...
                </>
              ) : (
                'Authorize AutoReply AI'
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="my-4 text-center space-y-1">
        <p className="text-[9px] text-slate-400 font-semibold">Logged in as Mahmud (mahmud@autoreply.ai)</p>
        <p className="text-[8px] text-slate-400">Facebook Meta Platform © 2026. All rights reserved.</p>
      </div>
    </div>
  );
};
