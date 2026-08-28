import React from 'react';
import { Link } from 'react-router-dom';
import { Bot } from 'lucide-react';

export const DashboardAIStatusCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-800 font-outfit">AI Status</h3>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-bold uppercase tracking-wide">
          Active
        </span>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
        <div className="p-2.5 bg-emerald-100 rounded-xl text-emerald-600">
          <Bot className="h-5 w-5" />
        </div>
        <p className="text-xs text-slate-600 leading-normal">AI is actively replying to your customers.</p>
      </div>

      <Link
        to="/ai"
        className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-colors"
      >
        Go to AI Settings
      </Link>
    </div>
  );
};
