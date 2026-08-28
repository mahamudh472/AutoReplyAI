import React from 'react';
import { Edit2, Plus, X } from 'lucide-react';
import type { Conversation } from '../../types/chat';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';

interface CustomerInfoPanelProps {
  conversation: Conversation;
  onToggleAI: (id: string) => void;
  onCloseConversation: (id: string) => void;
}

export const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  conversation,
  onToggleAI,
  onCloseConversation,
}) => {
  const getPlatformIcon = (platform: 'facebook' | 'instagram') => {
    if (platform === 'facebook') return <FacebookIcon className="h-3.5 w-3.5 text-blue-600" />;
    return <InstagramIcon className="h-3.5 w-3.5 text-pink-500" />;
  };

  return (
    <div className="w-full md:w-[280px] border-t md:border-t-0 md:border-l border-slate-200/80 bg-white h-auto md:h-full p-5 space-y-5 flex-shrink-0 overflow-y-auto min-h-0 flex flex-col">
      {/* Customer Info Card */}
      <div className="border border-slate-200 rounded-2xl p-4 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-150">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-outfit">
            Customer Info
          </h4>
          <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <Edit2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="relative w-14 h-14 mx-auto">
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="h-14 w-14 rounded-full object-cover border border-slate-200"
            />
            <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full shadow-sm">
              {getPlatformIcon(conversation.platform)}
            </span>
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 leading-tight">{conversation.name}</h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
              @{conversation.name.toLowerCase().replace(' ', '')}.messenger
            </p>
          </div>
        </div>

        {/* Detail parameters rows */}
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Platform</span>
            <span className="text-slate-850 font-bold">
              {conversation.platform === 'facebook' ? 'Messenger' : 'Instagram'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">First Contact</span>
            <span className="text-slate-850 font-bold">May 20, 2024</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Total Messages</span>
            <span className="text-slate-850 font-bold">28</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Location</span>
            <span className="text-slate-850 font-bold">New York, USA</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Language</span>
            <span className="text-slate-850 font-bold">English (US)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Customer Status</span>
            <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 text-[9px] font-bold">
              New Customer
            </span>
          </div>
        </div>
      </div>

      {/* Conversation Settings Card */}
      <div className="border border-slate-200 rounded-2xl p-4 space-y-4">
        <div className="pb-2 border-b border-slate-150">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-outfit">
            Conversation Settings
          </h4>
        </div>

        <div className="space-y-3.5 text-xs">
          {/* AI Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">AI Status</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                {conversation.aiEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={conversation.aiEnabled}
                  onChange={() => onToggleAI(conversation.id)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* AI Mode Selector */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">AI Mode</span>
            <select className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-700 focus:outline-none">
              <option value="automatic">Automatic</option>
              <option value="draft">Draft Review</option>
            </select>
          </div>

          {/* Assigned To Indicator */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-semibold">Assigned To</span>
            <span className="text-slate-700 font-bold flex items-center gap-1">
              Unassigned
              <Edit2 className="h-3 w-3 text-slate-400 cursor-pointer hover:text-slate-650" />
            </span>
          </div>

          {/* Labels tag system */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-semibold">Labels</span>
              <button className="text-blue-600 text-[10px] font-bold flex items-center gap-0.5 hover:text-blue-700 cursor-pointer">
                <Plus className="h-3 w-3" />
                Add Label
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-650 rounded-md border border-purple-200 text-[10px] font-bold">
                Interested
                <X className="h-2.5 w-2.5 cursor-pointer" />
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-650 rounded-md border border-emerald-250 text-[10px] font-bold">
                Skincare
                <X className="h-2.5 w-2.5 cursor-pointer" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Close thread action */}
      <button
        onClick={() => onCloseConversation(conversation.id)}
        className="w-full py-2.5 rounded-xl border border-rose-250 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-sm flex items-center justify-center cursor-pointer"
      >
        Close Conversation
      </button>
    </div>
  );
};
