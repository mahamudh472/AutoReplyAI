import React from 'react';

export const DashboardUsageCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 font-outfit mb-5">Usage This Month</h3>

      <div className="flex items-center justify-between gap-4">
        {/* Radial Meter SVG */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg width="80" height="80" viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeDasharray="24 76"
              strokeDashoffset="0"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-slate-850 leading-none">2,450</span>
            <span className="text-[7px] text-slate-400 mt-0.5 leading-none">/ 10k msgs</span>
          </div>
        </div>

        {/* Legend Info */}
        <div className="space-y-3.5 flex-1">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              <span className="font-semibold">Used</span>
            </div>
            <p className="text-xs text-slate-400 font-medium pl-3.5">2,450 (24%)</p>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-slate-300"></span>
              <span className="font-semibold">Remaining</span>
            </div>
            <p className="text-xs text-slate-400 font-medium pl-3.5">7,550 (76%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
