import React from 'react';
import { MessageSquare, Bot, Users, UserCheck } from 'lucide-react';

export const DashboardMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Metric 1: Messages Received */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Messages Received</p>
          <h3 className="text-2xl font-bold text-slate-800 font-outfit">142</h3>
          <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <span>↑ 18.5%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <MessageSquare className="h-5.5 w-5.5" />
        </div>
      </div>

      {/* Metric 2: AI Replies Sent */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Replies Sent</p>
          <h3 className="text-2xl font-bold text-slate-800 font-outfit">118</h3>
          <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <span>↑ 23.1%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
          </p>
        </div>
        <div className="p-3 bg-emerald-50/80 rounded-xl text-emerald-600">
          <Bot className="h-5.5 w-5.5" />
        </div>
      </div>

      {/* Metric 3: Open Conversations */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Conversations</p>
          <h3 className="text-2xl font-bold text-slate-800 font-outfit">16</h3>
          <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1">
            <span>↓ 5.4%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
          </p>
        </div>
        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
          <Users className="h-5.5 w-5.5" />
        </div>
      </div>

      {/* Metric 4: Human Replies */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center justify-between">
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Human Replies</p>
          <h3 className="text-2xl font-bold text-slate-800 font-outfit">24</h3>
          <p className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
            <span>↑ 8.7%</span> <span className="text-slate-400 font-normal">from last 7 days</span>
          </p>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
          <UserCheck className="h-5.5 w-5.5" />
        </div>
      </div>
    </div>
  );
};
