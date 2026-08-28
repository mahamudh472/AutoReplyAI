import React from 'react';
import { Filter } from 'lucide-react';
import type { Conversation } from '../../types/chat';
import { ConversationListItem } from './ConversationListItem';

interface ConversationListProps {
  conversations: Conversation[];
  filteredConversations: Conversation[];
  activeConversationId: string | null;
  typingConversationId: string | null;
  activeTab: 'open' | 'unread';
  onTabChange: (tab: 'open' | 'unread') => void;
  onSelectConversation: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  filteredConversations,
  activeConversationId,
  typingConversationId,
  activeTab,
  onTabChange,
  onSelectConversation,
}) => {
  return (
    <div className="w-full md:w-80 flex flex-col border-r border-slate-200/80 bg-white h-[200px] md:h-full flex-shrink-0 min-h-0">
      {/* Tabs header inside list */}
      <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
        <div className="flex gap-4 text-xs font-semibold">
          <button
            onClick={() => onTabChange('open')}
            className={`pb-1 transition-all cursor-pointer ${
              activeTab === 'open'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            Open{' '}
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px]">
              {conversations.length}
            </span>
          </button>
          <button
            onClick={() => onTabChange('unread')}
            className={`pb-1 transition-all cursor-pointer ${
              activeTab === 'unread'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-400 hover:text-slate-650'
            }`}
          >
            Unread{' '}
            <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px]">
              {conversations.filter((c) => c.unread).length}
            </span>
          </button>
        </div>

        <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer" title="Sort options">
          <Filter className="h-4 w-4" />
        </button>
      </div>

      {/* Conversations Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
        {filteredConversations.map((conv) => (
          <ConversationListItem
            key={conv.id}
            conversation={conv}
            isSelected={conv.id === activeConversationId}
            isTyping={typingConversationId === conv.id}
            onClick={() => onSelectConversation(conv.id)}
          />
        ))}
        {filteredConversations.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">No active conversations</div>
        )}
      </div>
    </div>
  );
};
