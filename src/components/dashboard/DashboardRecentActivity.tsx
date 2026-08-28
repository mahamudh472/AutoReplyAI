import React from 'react';
import { Link } from 'react-router-dom';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';

export const DashboardRecentActivity: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
        <h2 className="text-sm font-bold text-slate-800 font-outfit">Recent Conversations</h2>
        <Link
          to="/conversations"
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5"
        >
          <span>View all</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold border border-slate-200">
            Soon
          </span>
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {/* Customer Row 1: John Doe */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                alt="John Doe"
                className="h-9 w-9 rounded-full object-cover border border-slate-100"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                <FacebookIcon className="h-3 w-3 text-blue-600" />
              </span>
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-800">John Doe</h4>
                <span className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold">
                  ✓
                </span>
              </div>
              <p className="text-[11px] text-slate-450 truncate mt-0.5">
                Hi, I wanted to know more about your products.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
            <span className="text-[10px] text-slate-400">2m ago</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold">
              AI Reply
            </span>
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          </div>
        </div>

        {/* Customer Row 2: Emily Smith */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Emily Smith"
                className="h-9 w-9 rounded-full object-cover border border-slate-100"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                <InstagramIcon className="h-3 w-3 text-pink-500" />
              </span>
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-slate-800">Emily Smith</h4>
                <span className="h-3.5 w-3.5 rounded bg-gradient-to-tr from-yellow-500 to-purple-600 flex items-center justify-center text-white text-[7px] font-bold">
                  IG
                </span>
              </div>
              <p className="text-[11px] text-slate-450 truncate mt-0.5">Do you offer international shipping?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
            <span className="text-[10px] text-slate-400">15m ago</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-bold">
              AI Reply
            </span>
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          </div>
        </div>

        {/* Customer Row 3: Michael Lee */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Michael Lee"
                className="h-9 w-9 rounded-full object-cover border border-slate-100"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                <FacebookIcon className="h-3 w-3 text-blue-600" />
              </span>
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-800">Michael Lee</h4>
              <p className="text-[11px] text-slate-450 truncate mt-0.5">I need help with my order #1234</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
            <span className="text-[10px] text-slate-400">1h ago</span>
            <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-600 text-[9px] font-bold">
              Human
            </span>
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
          </div>
        </div>

        {/* Customer Row 4: Olivia Brown */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80"
                alt="Olivia Brown"
                className="h-9 w-9 rounded-full object-cover border border-slate-100"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                <InstagramIcon className="h-3 w-3 text-pink-500" />
              </span>
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-800">Olivia Brown</h4>
              <p className="text-[11px] text-slate-450 truncate mt-0.5">Thanks! That was helpful 😊</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
            <span className="text-[10px] text-slate-400">2h ago</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-600 text-[9px] font-bold">
              AI Reply
            </span>
            <span className="h-2 w-2 bg-transparent"></span>
          </div>
        </div>

        {/* Customer Row 5: David Wilson */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80"
                alt="David Wilson"
                className="h-9 w-9 rounded-full object-cover border border-slate-100"
              />
              <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full">
                <FacebookIcon className="h-3 w-3 text-blue-600" />
              </span>
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-slate-800">David Wilson</h4>
              <p className="text-[11px] text-slate-450 truncate mt-0.5">Is there any discount available?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 ml-2 flex-shrink-0">
            <span className="text-[10px] text-slate-400">3h ago</span>
            <span className="px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-orange-600 text-[9px] font-bold">
              Human
            </span>
            <span className="h-2 w-2 bg-transparent"></span>
          </div>
        </div>
      </div>
    </div>
  );
};
