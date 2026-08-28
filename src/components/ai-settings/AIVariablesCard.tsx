import React from 'react';
import { ChevronRight } from 'lucide-react';

export const AIVariablesCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-800 font-outfit">Dynamic Variables</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">Use variables to personalize AI responses dynamically.</p>
      </div>

      <div className="divide-y divide-slate-100 text-xs">
        <div className="flex justify-between py-2 items-center">
          <span className="font-mono font-bold text-blue-600">{'{{company_name}}'}</span>
          <span className="text-slate-500">Your organization name</span>
        </div>
        <div className="flex justify-between py-2 items-center">
          <span className="font-mono font-bold text-blue-600">{'{{customer_name}}'}</span>
          <span className="text-slate-500">Customer's name</span>
        </div>
        <div className="flex justify-between py-2 items-center">
          <span className="font-mono font-bold text-blue-600">{'{{current_date}}'}</span>
          <span className="text-slate-500">Current date</span>
        </div>
        <div className="flex justify-between py-2 items-center">
          <span className="font-mono font-bold text-blue-600">{'{{current_time}}'}</span>
          <span className="text-slate-500">Current time</span>
        </div>
        <div className="flex justify-between py-2 items-center">
          <span className="font-mono font-bold text-blue-600">{'{{platform}}'}</span>
          <span className="text-slate-500">Platform name</span>
        </div>
      </div>

      <button className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:text-blue-700 cursor-pointer">
        View all variables <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
