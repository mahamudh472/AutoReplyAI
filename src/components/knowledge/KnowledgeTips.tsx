import React from 'react';
import { Lightbulb } from 'lucide-react';

export const KnowledgeTips: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 font-outfit">
        <Lightbulb className="h-4.5 w-4.5 text-amber-500" />
        Optimization Tips
      </h3>

      <ul className="space-y-3 text-xs text-slate-500">
        <li className="flex items-start gap-2">
          <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[9px] font-bold">
            ✓
          </span>
          <span>Break down large documents into coherent sections or FAQs.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[9px] font-bold">
            ✓
          </span>
          <span>Tag documents with relevant keywords (e.g. #shipping, #refunds, #pricing).</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="h-4 w-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0 text-[9px] font-bold">
            ✓
          </span>
          <span>Toggle inactive older documents to prevent outdated answers.</span>
        </li>
      </ul>
    </div>
  );
};
