import React from 'react';
import { Building2 } from 'lucide-react';

interface AIBusinessInfoFormProps {
  businessName: string;
  businessDescription: string;
  onBusinessNameChange: (val: string) => void;
  onBusinessDescriptionChange: (val: string) => void;
}

export const AIBusinessInfoForm: React.FC<AIBusinessInfoFormProps> = ({
  businessName,
  businessDescription,
  onBusinessNameChange,
  onBusinessDescriptionChange,
}) => {
  return (
    <div className="space-y-4 py-2 border-b border-slate-100 pb-5">
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-blue-600" />
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Business Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Business Name</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            placeholder="e.g. Acme Corp"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-semibold text-slate-700">Business Description</label>
          <input
            type="text"
            value={businessDescription}
            onChange={(e) => onBusinessDescriptionChange(e.target.value)}
            placeholder="e.g. Online store selling premium custom mechanical keyboards."
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
          />
          <p className="text-[10px] text-slate-400">
            Gives AI the foundation context about what your business offers.
          </p>
        </div>
      </div>
    </div>
  );
};
