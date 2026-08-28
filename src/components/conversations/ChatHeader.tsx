import React from 'react';
import { Star, Tag, CheckSquare, MoreVertical } from 'lucide-react';
import type { Conversation } from '../../types/chat';

interface ChatHeaderProps {
  conversation: Conversation;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  return (
    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 flex-shrink-0">
      <div className="flex items-center gap-3">
        <img
          src={conversation.avatar}
          alt={conversation.name}
          className="h-9 w-9 rounded-full object-cover border border-slate-250"
        />
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-slate-800 leading-tight">{conversation.name}</h3>
            <span className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold shadow-sm">
              ✓
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] text-emerald-600 font-semibold">Active now</span>
          </div>
        </div>
      </div>

      {/* Conversation Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg cursor-pointer">
          <Star className="h-4 w-4" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg cursor-pointer">
          <Tag className="h-4 w-4" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg cursor-pointer">
          <CheckSquare className="h-4 w-4" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg cursor-pointer">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
