import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface DashboardSimulatePanelProps {
  onSimulate: (text?: string, fromCustomer?: string) => void;
}

export const DashboardSimulatePanel: React.FC<DashboardSimulatePanelProps> = ({ onSimulate }) => {
  const [showSimPanel, setShowSimPanel] = useState(false);
  const [customSimText, setCustomSimText] = useState('');
  const [customSimSender, setCustomSimSender] = useState('Alex');

  const handleSimulateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSimText.trim()) return;
    onSimulate(customSimText, customSimSender);
    setCustomSimText('');
    setShowSimPanel(false);
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-200/60">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowSimPanel(!showSimPanel)}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          <Play className="h-3 w-3 fill-slate-500 text-slate-500" />
          {showSimPanel ? 'Close Inquire Simulator' : 'Open Inquire Simulator'}
        </button>
        <span className="text-[10px] text-slate-450">Click to send test queries and review live responses.</span>
      </div>

      {showSimPanel && (
        <div className="glass-card p-5 rounded-2xl border border-blue-500/15 bg-blue-50/10 animate-fade-in space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              RAG Support Inquiry Simulator
            </h4>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onSimulate('Hi! Are you open on Sunday?', 'Emma')}
                className="px-2.5 py-1.5 bg-white border border-slate-250 text-slate-650 hover:bg-slate-50 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                Sunday Hours Preset
              </button>
              <button
                type="button"
                onClick={() => onSimulate('Do you ship to Canada? I want some boots.', 'Leo')}
                className="px-2.5 py-1.5 bg-white border border-slate-250 text-slate-650 hover:bg-slate-50 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                Shipping Preset
              </button>
            </div>
          </div>

          <form onSubmit={handleSimulateCustom} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1.5">Sender Name</label>
              <input
                type="text"
                placeholder="Sender name"
                value={customSimSender}
                onChange={(e) => setCustomSimSender(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="sm:col-span-2 flex gap-2">
              <div className="flex-1">
                <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1.5">Query Message</label>
                <input
                  type="text"
                  placeholder="What should the client say?"
                  value={customSimText}
                  onChange={(e) => setCustomSimText(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 glow-primary h-9 flex-shrink-0 self-end cursor-pointer"
              >
                <Play className="h-3 w-3 fill-white text-white" />
                Simulate
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
