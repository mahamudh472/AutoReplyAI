import React from 'react';
import type { Conversation } from '../../types/chat';
import { FacebookIcon, InstagramIcon } from '../SocialIcons';

interface ConversationListItemProps {
  conversation: Conversation;
  isSelected: boolean;
  isTyping: boolean;
  onClick: () => void;
}

export const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversation,
  isSelected,
  isTyping,
  onClick,
}) => {
  const lastMsg = conversation.messages[conversation.messages.length - 1];

  const getPlatformIcon = (platform: 'facebook' | 'instagram') => {
    if (platform === 'facebook') return <FacebookIcon className="h-3 w-3 text-blue-600" />;
    return <InstagramIcon className="h-3 w-3 text-pink-500" />;
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50 ${
        isSelected ? 'bg-blue-50/40 border-l-4 border-blue-600' : ''
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <div className="relative flex-shrink-0">
          <img
            src={conversation.avatar}
            alt={conversation.name}
            className="h-9 w-9 rounded-full object-cover border border-slate-100"
          />
          <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full shadow-sm">
            {getPlatformIcon(conversation.platform)}
          </span>
        </div>
        <div className="truncate flex-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              className={`text-xs font-bold truncate ${
                conversation.unread ? 'text-slate-900 font-extrabold' : 'text-slate-700'
              }`}
            >
              {conversation.name}
            </h4>
            <span className="text-[9px] text-slate-400 flex-shrink-0">{conversation.lastActivity}</span>
          </div>
          {isTyping ? (
            <p className="text-[11px] text-blue-600 font-semibold italic mt-0.5 animate-pulse">
              Typing reply...
            </p>
          ) : (
            <p
              className={`text-[11px] truncate mt-0.5 ${
                conversation.unread ? 'text-slate-900 font-semibold' : 'text-slate-450'
              }`}
            >
              {lastMsg ? lastMsg.text : 'No messages'}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 ml-2 flex-shrink-0">
        {conversation.aiEnabled ? (
          <span className="px-1.5 py-0.5 rounded border border-blue-200 text-blue-600 bg-blue-50 text-[9px] font-bold">
            AI
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded border border-orange-200 text-orange-600 bg-orange-50/50 text-[9px] font-bold">
            Human
          </span>
        )}
        {conversation.unread && <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0"></span>}
      </div>
    </div>
  );
};
