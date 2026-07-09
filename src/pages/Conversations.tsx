import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Send, 
  Trash2, 
  Check, 
  MessageSquare,
  Star,
  Tag,
  CheckSquare,
  MoreVertical,
  X,
  Edit2,
  Plus
} from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '../components/SocialIcons';

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
    typingConversationId
  } = useApp();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [channelFilter, setChannelFilter] = useState<'all' | 'facebook' | 'instagram'>('all');
  const [aiFilter, setAiFilter] = useState<'all' | 'ai' | 'human'>('all');
  const [unreadFilter, setUnreadFilter] = useState(false);
  const [activeTab, setActiveTab] = useState<'open' | 'unread'>('open');

  // Input states
  const [inputVal, setInputVal] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeConv = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    scrollToBottom();
    // Mark as read when active conversation changes
    if (activeConv && activeConv.unread) {
      activeConv.unread = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId, activeConv?.messages.length, typingConversationId]);

  // Load draft into input if it exists
  const activeDraft = activeConv?.messages.find(m => m.isDraft);
  
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

  const handleApproveDraftDirectly = () => {
    if (activeDraft) {
      approveDraftReply(activeConversationId!, activeDraft.text);
      setInputVal('');
    }
  };

  const handleEditDraft = () => {
    if (activeDraft) {
      setInputVal(activeDraft.text);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.messages.some(m => m.text.toLowerCase().includes(search.toLowerCase()));
    
    const matchesChannel = channelFilter === 'all' || c.platform === channelFilter;
    const matchesAI = aiFilter === 'all' || 
      (aiFilter === 'ai' && c.aiEnabled) || 
      (aiFilter === 'human' && !c.aiEnabled);
      
    const matchesUnread = activeTab === 'unread' ? c.unread : (!unreadFilter || c.unread);
    
    return matchesSearch && matchesChannel && matchesAI && matchesUnread;
  });

  const getPlatformIcon = (platform: 'facebook' | 'instagram', size = 'h-4 w-4') => {
    if (platform === 'facebook') return <FacebookIcon className={`${size} text-blue-600`} />;
    return <InstagramIcon className={`${size} text-pink-500`} />;
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-700 h-[calc(100vh-6.5rem)] flex flex-col">
      
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
        
        {/* Column 1: Conversations List (1/4 width) */}
        <div className="w-full md:w-80 flex flex-col border-r border-slate-200/80 bg-white h-[200px] md:h-full flex-shrink-0 min-h-0">
          {/* Tabs header inside list */}
          <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
            <div className="flex gap-4 text-xs font-semibold">
              <button
                onClick={() => {
                  setActiveTab('open');
                  setUnreadFilter(false);
                }}
                className={`pb-1 transition-all ${activeTab === 'open' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-400 hover:text-slate-650'}`}
              >
                Open <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px]">{conversations.length}</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('unread');
                }}
                className={`pb-1 transition-all ${activeTab === 'unread' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-slate-400 hover:text-slate-650'}`}
              >
                Unread <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px]">{conversations.filter(c => c.unread).length}</span>
              </button>
            </div>
            
            <button className="p-1 text-slate-400 hover:text-slate-600" title="Sort options">
              <Filter className="h-4 w-4" />
            </button>
          </div>

          {/* Conversations Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 min-h-0">
            {filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isTyping = typingConversationId === conv.id;
              const isSelected = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-slate-50/50 ${
                    isSelected ? 'bg-blue-50/40 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    <div className="relative flex-shrink-0">
                      <img src={conv.avatar} alt={conv.name} className="h-9 w-9 rounded-full object-cover border border-slate-100" />
                      <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full shadow-sm">
                        {getPlatformIcon(conv.platform, 'h-3 w-3')}
                      </span>
                    </div>
                    <div className="truncate flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className={`text-xs font-bold truncate ${conv.unread ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>{conv.name}</h4>
                        <span className="text-[9px] text-slate-400 flex-shrink-0">{conv.lastActivity}</span>
                      </div>
                      {isTyping ? (
                        <p className="text-[11px] text-blue-600 font-semibold italic mt-0.5 animate-pulse">Typing reply...</p>
                      ) : (
                        <p className={`text-[11px] truncate mt-0.5 ${conv.unread ? 'text-slate-900 font-semibold' : 'text-slate-450'}`}>
                          {lastMsg ? lastMsg.text : 'No messages'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 ml-2 flex-shrink-0">
                    {conv.aiEnabled ? (
                      <span className="px-1.5 py-0.5 rounded border border-blue-200 text-blue-600 bg-blue-50 text-[9px] font-bold">
                        AI
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded border border-orange-200 text-orange-600 bg-orange-50/50 text-[9px] font-bold">
                        Human
                      </span>
                    )}
                    {conv.unread && (
                      <span className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active conversations
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Chat Pane (2/4 width) */}
        <div className="flex-1 flex flex-col bg-white h-auto md:h-full min-h-0 relative border-r border-slate-200/80">
          {activeConv ? (
            <>
              {/* Chat View Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/20 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <img src={activeConv.avatar} alt={activeConv.name} className="h-9 w-9 rounded-full object-cover border border-slate-250" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-800 leading-tight">{activeConv.name}</h3>
                      <span className="h-3.5 w-3.5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold shadow-sm">✓</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Active now</span>
                    </div>
                  </div>
                </div>

                {/* Conversation Actions */}
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg">
                    <Star className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg">
                    <Tag className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg">
                    <CheckSquare className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Feed Scroll Area */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-[#fbfcfd] min-h-0">
                
                {/* Date Divider */}
                <div className="flex items-center justify-center my-4">
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                  <span className="px-3 text-[10px] font-bold text-slate-405 uppercase tracking-wider bg-[#fbfcfd]">Today</span>
                  <div className="h-[1px] bg-slate-200 flex-1"></div>
                </div>

                {activeConv.messages.map((msg) => {
                  const isCustomer = msg.sender === 'customer';
                  const isUser = msg.sender === 'user';
                  const isAI = msg.sender === 'ai';
                  const isDraft = msg.isDraft || msg.sender === 'ai-draft';

                  return (
                    <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'} items-start gap-2.5 animate-fade-in`}>
                      
                      {/* Left Avatar for customer replies */}
                      {isCustomer && (
                        <img 
                          src={activeConv.avatar} 
                          alt={activeConv.name} 
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
                                : 'bg-amber-50 border border-dashed border-amber-300 text-slate-800 rounded-tr-none' // Draft state
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>
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
                              onClick={handleApproveDraftDirectly}
                              className="px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500 hover:text-black transition-all rounded-lg text-[10px] font-bold text-amber-700 flex items-center gap-1"
                            >
                              <Check className="h-3 w-3" />
                              Send Draft
                            </button>
                            <button
                              onClick={handleEditDraft}
                              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 transition-colors rounded-lg text-[10px] font-semibold text-slate-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => discardDraftReply(activeConv.id)}
                              className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors rounded-lg"
                              title="Discard draft"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Timestamp & read double check marks */}
                        <div className={`text-[9px] text-slate-400 flex items-center gap-1 ${isCustomer ? 'justify-start' : 'justify-end'} px-1`}>
                          <span>{msg.timestamp}</span>
                          {!isCustomer && (
                            <span className="text-emerald-500 font-bold" title="Read">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {typingConversationId === activeConv.id && (
                  <div className="flex justify-start items-start gap-2.5">
                    <img 
                      src={activeConv.avatar} 
                      alt={activeConv.name} 
                      className="h-7 w-7 rounded-full object-cover border border-slate-200 flex-shrink-0" 
                    />
                    <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat View Input Box */}
              <div className="p-4 border-t border-slate-100 bg-white flex-shrink-0">
                <form onSubmit={handleSend} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder={activeDraft ? "Edit the suggested AI draft above or write a message..." : "Type a reply..."}
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    disabled={!inputVal.trim() && !activeDraft}
                    className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-40 active:scale-95 flex-shrink-0 flex items-center justify-center glow-primary"
                  >
                    <Send className="h-4.5 w-4.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <MessageSquare className="h-12 w-12 text-slate-200 mb-3" />
              <p className="text-sm font-semibold">Select a conversation to start messaging</p>
            </div>
          )}
        </div>

        {/* Column 3: Customer Info & Settings (1/4 width) */}
        {activeConv && (
          <div className="w-full md:w-[280px] border-t md:border-t-0 md:border-l border-slate-200/80 bg-white h-auto md:h-full p-5 space-y-5 flex-shrink-0 overflow-y-auto min-h-0 flex flex-col">
            
            {/* Customer Info Card */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-150">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-outfit">Customer Info</h4>
                <button className="text-slate-400 hover:text-slate-600">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-center space-y-2">
                <div className="relative w-14 h-14 mx-auto">
                  <img src={activeConv.avatar} alt={activeConv.name} className="h-14 w-14 rounded-full object-cover border border-slate-200" />
                  <span className="absolute bottom-0 right-0 p-0.5 bg-white rounded-full shadow-sm">
                    {getPlatformIcon(activeConv.platform, 'h-3.5 w-3.5')}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 leading-tight">{activeConv.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                    @{activeConv.name.toLowerCase().replace(' ', '')}.messenger
                  </p>
                </div>
              </div>

              {/* Detail parameters rows */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Platform</span>
                  <span className="text-slate-850 font-bold">
                    {activeConv.platform === 'facebook' ? 'Messenger' : 'Instagram'}
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
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-outfit">Conversation Settings</h4>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* AI Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">AI Status</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">
                      {activeConv.aiEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeConv.aiEnabled}
                        onChange={() => toggleConversationAI(activeConv.id)}
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
                    <button className="text-blue-600 text-[10px] font-bold flex items-center gap-0.5 hover:text-blue-700">
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
              onClick={() => closeConversation(activeConv.id)}
              className="w-full py-2.5 rounded-xl border border-rose-250 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all shadow-sm flex items-center justify-center"
            >
              Close Conversation
            </button>

          </div>
        )}
      </div>

    </div>
  );
};
