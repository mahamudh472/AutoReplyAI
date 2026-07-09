import React, { useState } from 'react';
import { Key, AlertCircle, Copy, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (name: string, scope: 'Full Access' | 'Read Only') => void;
  generatedKey: string;
  onCopy: (key: string) => void;
  copied: boolean;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onGenerate,
  generatedKey,
  onCopy,
  copied,
}) => {
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState<'Full Access' | 'Read Only'>('Full Access');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    onGenerate(newKeyName, newKeyScope);
    setNewKeyName('');
  };

  const handleClose = () => {
    setNewKeyName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl w-full max-w-md mx-4 space-y-5 animate-slide-in">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Key className="h-5.5 w-5.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-850 font-outfit">Create New API Key</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Authenticate integrations.</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            &times;
          </button>
        </div>

        {generatedKey ? (
          <div className="space-y-4">
            <div className="p-3.5 bg-green-50 text-green-700 text-[10px] font-bold rounded-xl border border-green-200/50 flex items-start gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <span>Please copy your API key now. For security purposes, it will not be shown again.</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-1.5">
              <label className="block text-[9px] uppercase font-bold text-slate-400">Secret Token</label>
              <div className="flex justify-between items-center font-mono text-xs font-bold text-slate-800">
                <code className="truncate max-w-[85%]">{generatedKey}</code>
                <button
                  onClick={() => onCopy(generatedKey)}
                  className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-700 cursor-pointer"
                  title="Copy Key"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleClose}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Key Name</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g. Mobile App Bot, Production Sync"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-semibold shadow-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Permission Scope</label>
              <select
                value={newKeyScope}
                onChange={(e) => setNewKeyScope(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
              >
                <option value="Full Access">Full Access (Read/Write)</option>
                <option value="Read Only">Read Only</option>
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-slate-200 text-slate-655 hover:bg-slate-50 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Generate Key
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
