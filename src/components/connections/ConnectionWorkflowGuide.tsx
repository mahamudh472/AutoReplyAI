import React from 'react';
import { Info } from 'lucide-react';

export const ConnectionWorkflowGuide: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <h4 className="text-xs font-bold text-slate-700 flex items-center gap-2 mb-6 font-outfit">
        <Info className="h-4.5 w-4.5 text-blue-650" />
        How Meta Connection Works
      </h4>

      {/* Steps deck flex layout */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Step 1 */}
        <div className="flex items-start gap-4 flex-1">
          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
            1
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-800">1. Connect</h5>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Connect your Meta account and grant required permissions.
            </p>
          </div>
        </div>

        {/* Arrow */}
        <span className="hidden md:block text-slate-350 text-lg flex-shrink-0 px-2">→</span>

        {/* Step 2 */}
        <div className="flex items-start gap-4 flex-1">
          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
            2
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-800">2. Webhook Setup</h5>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              We'll set up webhooks to receive messages in real-time.
            </p>
          </div>
        </div>

        {/* Arrow */}
        <span className="hidden md:block text-slate-350 text-lg flex-shrink-0 px-2">→</span>

        {/* Step 3 */}
        <div className="flex items-start gap-4 flex-1">
          <div className="h-10 w-10 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
            3
          </div>
          <div className="space-y-1">
            <h5 className="text-xs font-bold text-slate-800">3. Sync & Ready</h5>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Start managing conversations and enable AI replies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
