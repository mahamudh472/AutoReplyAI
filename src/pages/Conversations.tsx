import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Filter, MessageSquare } from 'lucide-react';
import { ComingSoonOverlay } from '../components/ComingSoonOverlay';
import {
  ConversationList,
  ChatMessageList,
  ChatHeader,
  CustomerInfoPanel,
  ChatInputBar,
} from '../components/conversations';

export const Conversations: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendManualReply,
    toggleConversationAI,
    closeConversation,
    approveDraftReply,
    discardDraftReply,
    typingConversationId,
  } = useApp();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'facebook' | 'instagram'>('all');
  const [aiFilter, setAiFilter] = useState<'all' | 'ai' | 'human'>('all');
  const [unreadFilter, setUnreadFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<'open' | 'unread'>('open');

  // Input state
  const [inputVal, setInputVal] = useState('');

  const activeConv = conversations.find((c) => c.id === activeConversationId);

  useEffect(() => {
    if (activeConv && activeConv.unread) {
      activeConv.unread = false;
    }
  }, [activeConversationId, activeConv]);

  const activeDraft = activeConv?.messages.find((m) => m.isDraft);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    if (activeDraft) {
      approveDraftReply(activeConversationId!, inputVal);
    } else {
      sendManualReply(inputVal);
    }
    setInputVal('');
  };

  const handleApproveDraft = (convId: string, text: string) => {
    approveDraftReply(convId, text);
    setInputVal('');
  };

  const handleEditDraft = (draftText: string) => {
    setInputVal(draftText);
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(search.toLowerCase()));

    const matchesChannel = channelFilter === 'all' || c.platform === channelFilter;
    const matchesAI =
      aiFilter === 'all' || (aiFilter === 'ai' && c.aiEnabled) || (aiFilter === 'human' && !c.aiEnabled);

    const matchesUnread = activeTab === 'unread' ? c.unread : !unreadFilter || c.unread;

    return matchesSearch && matchesChannel && matchesAI && matchesUnread;
  });

  return (
    <div className="relative h-[calc(100vh-6.5rem)]">
      {/* Coming Soon Frosted Overlay */}
      <ComingSoonOverlay
        title="Coming Soon"
        badge="Feature In Progress"
        description="The live conversation inbox is currently under active development. AutoReply AI is actively replying to your customer inquiries automatically in the background."
      />

      {/* Blurred background view (spoiler preview) */}
      <div className="space-y-5 animate-fade-in text-slate-700 h-full flex flex-col filter blur-[1.5px] pointer-events-none select-none opacity-85">
        {/* 1. Header and Filters Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-805 font-outfit">Conversations</h1>
          </div>

          {/* Filters Panel Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 py-2 w-56 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400 px-1 bg-slate-100 rounded border border-slate-200 pointer-events-none">
                ⌘K
              </span>
            </div>

            {/* All Channels Dropdown */}
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-650 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="all">All Channels</option>
              <option value="facebook">Facebook Messenger</option>
              <option value="instagram">Instagram Direct</option>
            </select>

            {/* AI Status Dropdown */}
            <select
              value={aiFilter}
              onChange={(e) => setAiFilter(e.target.value as any)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-650 text-xs font-semibold focus:outline-none focus:border-blue-500 shadow-sm"
            >
              <option value="all">AI Status</option>
              <option value="ai">AI Active</option>
              <option value="human">Human Only</option>
            </select>

            {/* Unread Checkbox */}
            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 shadow-sm cursor-pointer hover:bg-slate-50 select-none">
              <input
                type="checkbox"
                checked={unreadFilter}
                onChange={(e) => setUnreadFilter(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 border-slate-300"
              />
              <span>Unread</span>
            </label>

            {/* Settings / Extra Filter Button */}
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 2. Main 3-Column Layout Workspace */}
        <div className="flex-1 flex flex-col md:flex-row border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm min-h-0">
          {/* Column 1: Conversations List */}
          <ConversationList
            conversations={conversations}
            filteredConversations={filteredConversations}
            activeConversationId={activeConversationId}
            typingConversationId={typingConversationId}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              if (tab === 'open') setUnreadFilter(false);
            }}
            onSelectConversation={setActiveConversationId}
          />

          {/* Column 2: Chat Pane */}
          <div className="flex-1 flex flex-col bg-white h-auto md:h-full min-h-0 relative border-r border-slate-200/80">
            {activeConv ? (
              <>
                <ChatHeader conversation={activeConv} />
                <ChatMessageList
                  conversation={activeConv}
                  isTyping={typingConversationId === activeConv.id}
                  onApproveDraft={handleApproveDraft}
                  onEditDraft={handleEditDraft}
                  onDiscardDraft={discardDraftReply}
                />
                <ChatInputBar
                  inputVal={inputVal}
                  hasDraft={Boolean(activeDraft)}
                  onInputChange={setInputVal}
                  onSend={handleSend}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="h-12 w-12 text-slate-200 mb-3" />
                <p className="text-sm font-semibold">Select a conversation to start messaging</p>
              </div>
            )}
          </div>

          {/* Column 3: Customer Info & Settings */}
          {activeConv && (
            <CustomerInfoPanel
              conversation={activeConv}
              onToggleAI={toggleConversationAI}
              onCloseConversation={closeConversation}
            />
          )}
        </div>
      </div>
    </div>
  );
};
