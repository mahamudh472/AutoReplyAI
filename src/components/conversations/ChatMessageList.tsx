import React, { useRef, useEffect } from 'react';
import type { Conversation, Message } from '../../types/chat';
import { ChatMessageBubble } from './ChatMessageBubble';

interface ChatMessageListProps {
  conversation: Conversation;
  isTyping: boolean;
  onApproveDraft: (conversationId: string, text: string) => void;
  onEditDraft: (draftText: string) => void;
  onDiscardDraft: (conversationId: string) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  conversation,
  isTyping,
  onApproveDraft,
  onEditDraft,
  onDiscardDraft,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages.length, isTyping]);

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#fbfcfd] min-h-0">
      {/* Date Divider */}
      <div className="flex items-center justify-center my-4">
        <div className="h-[1px] bg-slate-200 flex-1"></div>
        <span className="px-3 text-[10px] font-bold text-slate-405 uppercase tracking-wider bg-[#fbfcfd]">
          Today
        </span>
        <div className="h-[1px] bg-slate-200 flex-1"></div>
      </div>

      {conversation.messages.map((msg: Message) => (
        <ChatMessageBubble
          key={msg.id}
          message={msg}
          customerAvatar={conversation.avatar}
          customerName={conversation.name}
          onApproveDraft={() => onApproveDraft(conversation.id, msg.text)}
          onEditDraft={() => onEditDraft(msg.text)}
          onDiscardDraft={() => onDiscardDraft(conversation.id)}
        />
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="flex justify-start items-start gap-2.5">
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className="h-7 w-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
          />
          <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: '0ms' }}
            ></span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: '150ms' }}
            ></span>
            <span
              className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: '300ms' }}
            ></span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};
