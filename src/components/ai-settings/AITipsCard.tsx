import React from 'react';
import { Lightbulb, ArrowUpRight } from 'lucide-react';

export const AITipsCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-outfit">
        <Lightbulb className="h-4.5 w-4.5 text-blue-600" />
        Tips for Best Results
      </h3>

      <ul className="list-disc list-outside pl-4 space-y-2 text-xs text-slate-500">
        <li>Keep business descriptions clear and focused on customer FAQs.</li>
        <li>Use temperature between 0.3 - 0.7 for high factual consistency.</li>
        <li>Specify explicit fallback behavior when inquiries require escalation.</li>
      </ul>

      <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700 cursor-pointer">
        Learn more about prompt tuning <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};
