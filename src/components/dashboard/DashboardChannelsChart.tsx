import React from 'react';

export const DashboardChannelsChart: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-slate-800 font-outfit mb-6">Top Channels</h3>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Donut Chart SVG */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg width="120" height="120" viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3.2" />

            {/* Messenger Path (53% - blue) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.2"
              strokeDasharray="53 47"
              strokeDashoffset="0"
            />

            {/* Instagram Path (46% - pink) */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="none"
              stroke="#ec4899"
              strokeWidth="3.2"
              strokeDasharray="46 54"
              strokeDashoffset="-53"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-slate-800">2,450</span>
            <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend list */}
        <div className="space-y-3 w-full max-w-[200px]">
          <div className="flex items-center justify-between text-xs text-slate-650">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
              <span className="font-medium">Messenger</span>
            </div>
            <span className="font-bold text-slate-800">
              1,320 <span className="text-slate-400 font-normal text-[10px]">(53%)</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-650">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-pink-500"></span>
              <span className="font-medium">Instagram</span>
            </div>
            <span className="font-bold text-slate-800">
              1,130 <span className="text-slate-400 font-normal text-[10px]">(46%)</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-650">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
              <span className="font-medium">Other</span>
            </div>
            <span className="font-bold text-slate-800">
              0 <span className="text-slate-400 font-normal text-[10px]">(0%)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
