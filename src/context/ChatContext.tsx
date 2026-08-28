import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Conversation, Message } from '../types/chat';
import type { KBDocument } from '../types/knowledgeBase';
import type { Organization } from '../types/organization';
import { getDefaultConversations, DEFAULT_KB } from '../constants/defaults';
import { useOrg } from './OrgContext';
import { useBilling } from './BillingContext';

export interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  typingConversationId: string | null;
  knowledgeBase: KBDocument[];
  setActiveConversationId: (id: string | null) => void;
  sendManualReply: (text: string) => void;
  toggleConversationAI: (conversationId: string) => void;
  closeConversation: (conversationId: string) => void;
  simulateIncomingMessage: (text?: string, fromCustomer?: string) => void;
  approveDraftReply: (conversationId: string, text: string) => void;
  discardDraftReply: (conversationId: string) => void;
  addKBText: (title: string, content: string) => void;
  uploadKBFile: (name: string, type: 'pdf' | 'docx' | 'txt', content: string) => void;
  deleteKBDocument: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { organizations, activeOrgId } = useOrg();
  const { incrementMessageUsage } = useBilling();

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('replyai_conversations');
    return saved ? JSON.parse(saved) : getDefaultConversations('org-abc');
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>('c1');
  const [typingConversationId, setTypingConversationId] = useState<string | null>(null);

  const [knowledgeBase, setKnowledgeBase] = useState<KBDocument[]>(() => {
    const saved = localStorage.getItem('replyai_kb');
    return saved ? JSON.parse(saved) : DEFAULT_KB;
  });

  useEffect(() => {
    localStorage.setItem('replyai_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('replyai_kb', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  // Synchronize when switching organizations
  useEffect(() => {
    if (!activeOrgId) return;
    const loadedConversations = localStorage.getItem(`replyai_conversations_${activeOrgId}`);
    if (loadedConversations) {
      const parsed = JSON.parse(loadedConversations);
      setConversations(parsed);
      if (parsed.length > 0) setActiveConversationId(parsed[0].id);
      else setActiveConversationId(null);
    } else {
      const fresh = getDefaultConversations(activeOrgId);
      setConversations(fresh);
      if (fresh.length > 0) setActiveConversationId(fresh[0].id);
      else setActiveConversationId(null);
    }
  }, [activeOrgId]);

  useEffect(() => {
    if (activeOrgId) {
      localStorage.setItem(`replyai_conversations_${activeOrgId}`, JSON.stringify(conversations));
    }
  }, [conversations, activeOrgId]);

  const sendManualReply = (text: string) => {
    if (!activeConversationId) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            unread: false,
            lastActivity: 'Just now',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );

    incrementMessageUsage(1);
  };

  const toggleConversationAI = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, aiEnabled: !conv.aiEnabled };
        }
        return conv;
      })
    );
  };

  const closeConversation = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return { ...conv, status: conv.status === 'open' ? 'closed' : 'open' };
        }
        return conv;
      })
    );
  };

  const approveDraftReply = (conversationId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const cleanedMessages = conv.messages.filter((m) => !m.isDraft);
          const approvedMsg: Message = {
            id: 'msg-' + Date.now(),
            sender: 'ai',
            text,
            timestamp,
          };
          return {
            ...conv,
            lastActivity: 'Just now',
            messages: [...cleanedMessages, approvedMsg],
          };
        }
        return conv;
      })
    );

    incrementMessageUsage(1);
  };

  const discardDraftReply = (conversationId: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            messages: conv.messages.filter((m) => !m.isDraft),
          };
        }
        return conv;
      })
    );
  };

  const generateMockAIResponse = (customerQuery: string, currentOrg: Organization): string => {
    const query = customerQuery.toLowerCase();

    let matchingKBContent = '';
    for (const doc of knowledgeBase) {
      if (doc.status === 'ready') {
        const sentences = doc.content.split('. ');
        const matched = sentences.filter((s) => {
          const words = s.toLowerCase().split(' ');
          return words.some((w) => w.length > 3 && query.includes(w));
        });
        if (matched.length > 0) {
          matchingKBContent += matched.join('. ') + '. ';
        }
      }
    }

    const hasClosedKeyword =
      query.includes('hours') || query.includes('open') || query.includes('close') || query.includes('sunday');
    const hasShippingKeyword =
      query.includes('ship') || query.includes('delivery') || query.includes('shipping') || query.includes('canada');
    const hasRefundKeyword = query.includes('refund') || query.includes('return') || query.includes('refunds');

    let response = '';

    if (matchingKBContent) {
      response = `Hi! Based on our documentation: ${matchingKBContent.trim()}`;
    } else {
      if (hasClosedKeyword) {
        response = `Our physical stores are open Monday to Saturday from 9:00 AM to 8:00 PM EST. We are closed on Sundays. However, you can place orders online 24/7!`;
      } else if (hasShippingKeyword) {
        response = `Yes, we offer worldwide shipping! Standard shipping in the US is free for orders over $75. We also ship to Canada for a flat rate of $15 (free over $150).`;
      } else if (hasRefundKeyword) {
        response = `We offer a 30-day return policy on unworn, unwashed items with tags attached. Please send us your order number, and I can walk you through the return process.`;
      } else {
        response = `Thank you for reaching out to us! We've received your query. A member of our support team will get back to you shortly, or if you'd like, I can help answer other questions regarding shipping, returns, or business hours!`;
      }
    }

    if (currentOrg.model === 'Claude') {
      response = `Greetings! Thank you for contacting our customer service desk today. \n\n${response} \n\nPlease let me know if there is anything else I can do to make your experience more delightful.`;
    } else if (currentOrg.model === 'Gemini') {
      response = `Hey there! Glad to assist you today. Here is the information you requested:\n\n• ${response.replace(
        '. ',
        '\n• '
      )}\n\nHope this helps! Let me know if you need anything else.`;
    } else if (currentOrg.model === 'GPT-5.5') {
      response = `[AI Auto-Response] ${response} Please reply if you require further assistance.`;
    }

    return response;
  };

  const simulateIncomingMessage = (text?: string, fromCustomer?: string) => {
    const randomQueries = [
      'Hello! Are you guys open on Sunday?',
      'Hi support, do you ship to Canada? I want to order some items.',
      "Hello! What is your return policy? I bought a shirt that doesn't fit.",
      'Hey, is it possible to speak to a human representative?',
      'Hi, do you have any promo codes available for new shoppers?',
    ];

    const randomNames = ['Sara Jenkins', 'David Miller', 'Alice Cooper', 'Robert Chen', 'Elena Rostova'];

    const org = organizations.find((o) => o.id === activeOrgId) || organizations[0];
    const incomingText = text || randomQueries[Math.floor(Math.random() * randomQueries.length)];
    const customerName = fromCustomer || randomNames[Math.floor(Math.random() * randomNames.length)];

    let targetConv = conversations.find((c) => c.name.toLowerCase() === customerName.toLowerCase());
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let targetId = '';
    const incomingMsg: Message = {
      id: 'msg-in-' + Date.now(),
      sender: 'customer',
      text: incomingText,
      timestamp,
    };

    if (targetConv) {
      targetId = targetConv.id;
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === targetId) {
            return {
              ...conv,
              unread: true,
              status: 'open',
              lastActivity: 'Just now',
              messages: [...conv.messages, incomingMsg],
            };
          }
          return conv;
        })
      );
    } else {
      targetId = 'conv-' + Date.now();
      const platforms: ('facebook' | 'instagram')[] = ['facebook', 'instagram'];
      const chosenPlatform = platforms[Math.floor(Math.random() * 2)];
      const newConv: Conversation = {
        id: targetId,
        name: customerName,
        platform: chosenPlatform,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=100&auto=format&fit=crop&q=80`,
        aiEnabled: true,
        status: 'open',
        unread: true,
        lastActivity: 'Just now',
        messages: [incomingMsg],
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(targetId);
    }

    const currentConvState = conversations.find((c) => c.id === targetId) || { aiEnabled: true };
    const canUseAI = org.aiEnabled && currentConvState.aiEnabled;

    if (canUseAI) {
      setTypingConversationId(targetId);

      setTimeout(() => {
        const aiText = generateMockAIResponse(incomingText, org);
        const aiMsg: Message = {
          id: 'msg-ai-' + Date.now(),
          sender: org.aiMode === 'Automatic' ? 'ai' : 'ai-draft',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDraft: org.aiMode === 'Draft Only',
        };

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === targetId) {
              const filteredMessages = conv.messages.filter((m) => !m.isDraft);
              return {
                ...conv,
                unread: org.aiMode === 'Draft Only' ? conv.unread : false,
                messages: [...filteredMessages, aiMsg],
              };
            }
            return conv;
          })
        );

        setTypingConversationId(null);
        if (org.aiMode === 'Automatic') {
          incrementMessageUsage(1);
        }
      }, 1500);
    }
  };

  const addKBText = (title: string, content: string) => {
    const newDoc: KBDocument = {
      id: 'kb-' + Date.now(),
      name: title.endsWith('.txt') ? title : `${title}.txt`,
      type: 'text',
      content,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'ready',
    };
    setKnowledgeBase((prev) => [newDoc, ...prev]);
  };

  const uploadKBFile = (name: string, type: 'pdf' | 'docx' | 'txt', content: string) => {
    const newDoc: KBDocument = {
      id: 'kb-' + Date.now(),
      name,
      type,
      content,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'indexing',
    };
    setKnowledgeBase((prev) => [newDoc, ...prev]);

    setTimeout(() => {
      setKnowledgeBase((prev) =>
        prev.map((doc) => {
          if (doc.id === newDoc.id) {
            return { ...doc, status: 'ready' };
          }
          return doc;
        })
      );
    }, 2500);
  };

  const deleteKBDocument = (id: string) => {
    setKnowledgeBase((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        typingConversationId,
        knowledgeBase,
        setActiveConversationId,
        sendManualReply,
        toggleConversationAI,
        closeConversation,
        simulateIncomingMessage,
        approveDraftReply,
        discardDraftReply,
        addKBText,
        uploadKBFile,
        deleteKBDocument,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
