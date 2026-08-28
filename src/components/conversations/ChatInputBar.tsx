import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputBarProps {
  inputVal: string;
  hasDraft: boolean;
  onInputChange: (val: string) => void;
  onSend: (e: React.FormEvent) => void;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  inputVal,
  hasDraft,
  onInputChange,
  onSend,
}) => {
  return (
    <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
      <form onSubmit={onSend} className="flex gap-2 items-center">
        <input
          type="text"
          placeholder={
            hasDraft
              ? 'Edit the suggested AI draft above or write a message...'
              : 'Type a reply...'
          }
          value={inputVal}
          onChange={(e) => onInputChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() && !hasDraft}
          className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-40 active:scale-95 flex-shrink-0 flex items-center justify-center glow-primary cursor-pointer"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
};
