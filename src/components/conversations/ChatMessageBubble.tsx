import React from 'react';
import { Sparkles, Check, Trash2 } from 'lucide-react';
import type { Message } from '../../types/chat';

interface ChatMessageBubbleProps {
  message: Message;
  customerAvatar: string;
  customerName: string;
  onApproveDraft?: () => void;
  onEditDraft?: () => void;
  onDiscardDraft?: () => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  customerAvatar,
  customerName,
  onApproveDraft,
  onEditDraft,
  onDiscardDraft,
}) => {
  const isCustomer = message.sender === 'customer';
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isDraft = message.isDraft || message.sender === 'ai-draft';

  return (
    <div
      className={`flex ${
        isCustomer ? 'justify-start' : 'justify-end'
      } items-start gap-2.5 animate-fade-in`}
    >
      {/* Left Avatar for customer replies */}
      {isCustomer && (
        <img
          src={customerAvatar}
          alt={customerName}
          className="h-7 w-7 rounded-full object-cover border border-slate-200 flex-shrink-0 mt-0.5"
        />
      )}

      <div className="max-w-[70%] space-y-1">
        {/* Draft indicator banner */}
        {isDraft && (
          <div className="flex items-center gap-1 text-[9px] text-amber-600 font-extrabold uppercase tracking-wider pl-1 select-none">
            <Sparkles className="h-3 w-3 animate-spin text-amber-500" />
            AI Suggested Draft
          </div>
        )}

        <div className="flex items-end gap-1.5 relative group">
          {/* Chat bubble element */}
          <div
            className={`p-3 rounded-2xl text-xs leading-relaxed ${
              isCustomer
                ? 'bg-slate-100 text-slate-800 rounded-tl-none'
                : isUser
                ? 'bg-blue-600 text-white rounded-tr-none'
                : isAI
                ? 'bg-blue-50/70 border border-blue-100 text-slate-800 rounded-tr-none shadow-sm'
                : 'bg-amber-50 border border-dashed border-amber-300 text-slate-800 rounded-tr-none'
            }`}
          >
            <p className="whitespace-pre-line">{message.text}</p>
          </div>

          {/* AI label banner indicator on the right of AI replies */}
          {isAI && (
            <span className="self-end px-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-600 text-[8px] font-black tracking-wide leading-none py-0.5">
              AI
            </span>
          )}
        </div>

        {/* Message actions for review draft mode */}
        {isDraft && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onApproveDraft}
              className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-all rounded-lg text-[10px] font-bold text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <Check className="h-3 w-3" />
              Send Draft
            </button>
            <button
              onClick={onEditDraft}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 transition-colors rounded-lg text-[10px] font-semibold text-slate-600 cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={onDiscardDraft}
              className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors rounded-lg cursor-pointer"
              title="Discard draft"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Timestamp & read double check marks */}
        <div
          className={`text-[9px] text-slate-400 flex items-center gap-1 ${
            isCustomer ? 'justify-start' : 'justify-end'
          } px-1`}
        >
          <span>{message.timestamp}</span>
          {!isCustomer && (
            <span className="text-emerald-500 font-bold" title="Read">
              ✓✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
