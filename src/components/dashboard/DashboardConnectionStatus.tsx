import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';

export const DashboardConnectionStatus: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-slate-800 font-outfit">Connection Status</h3>
        <Link to="/connections" className="text-xs text-blue-600 font-semibold hover:text-blue-700">
          View all
        </Link>
      </div>

      <div className="space-y-4">
        {/* Row 1: Facebook Page */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FacebookIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-800">Facebook Page</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">ABC Store</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-250 text-emerald-600 text-[10px] font-bold">
              Connected
            </span>
            <button className="p-1 text-slate-450 hover:text-slate-700 cursor-pointer">
              <MoreVertical className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Row 2: Instagram */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-xl">
              <InstagramIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <h5 className="font-bold text-slate-800">Instagram Business</h5>
              <p className="text-[10px] text-slate-400 mt-0.5">@abc_store</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-250 text-emerald-600 text-[10px] font-bold">
              Connected
            </span>
            <button className="p-1 text-slate-450 hover:text-slate-700 cursor-pointer">
              <MoreVertical className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
