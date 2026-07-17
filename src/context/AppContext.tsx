import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, apiRequest, getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/api';

// Types
export interface Message {
  id: string;
  sender: 'customer' | 'user' | 'ai' | 'ai-draft';
  text: string;
  timestamp: string;
  isDraft?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram';
  avatar: string;
  messages: Message[];
  aiEnabled: boolean;
  status: 'open' | 'closed';
  unread: boolean;
  lastActivity: string;
}

export interface Connection {
  platform: 'facebook' | 'instagram';
  connected: boolean;
  pageName?: string;
  pageId?: string;
  lastSync?: string;
  webhookStatus?: 'active' | 'inactive';
}

export interface KBDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'text';
  content: string;
  uploadDate: string;
  status: 'indexing' | 'ready';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
  status: 'active' | 'invited';
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  timezone: string;
  language: string;
  aiEnabled: boolean;
  aiMode: 'Automatic' | 'Draft Only';
  model: 'GPT-5.5' | 'GPT-4.1' | 'Claude' | 'Gemini';
  prompt: string;
  temperature: number;
  maxTokens: number;
  team: TeamMember[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phoneNumber?: string | null;
  onboardingCompleted: boolean;
  notifications: {
    newMessages: boolean;
    aiReplies: boolean;
    weeklyDigest: boolean;
  };
}

interface AppContextType {
  user: User | null;
  organizations: Organization[];
  activeOrgId: string | null;
  connections: Connection[];
  conversations: Conversation[];
  knowledgeBase: KBDocument[];
  billing: {
    tier: string;
    messagesUsed: number;
    messageLimit: number;
    renewalDate: string;
  };
  typingConversationId: string | null;
  activeConversationId: string | null;
  
  // Actions
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Org Actions
  createOrg: (name: string, logoUrl?: string) => string;
  selectOrg: (id: string) => void;
  updateOrgSettings: (updates: Partial<Organization>) => void;
  inviteTeamMember: (email: string, name: string, role: 'owner' | 'member') => void;
  removeTeamMember: (id: string) => void;
  
  // Connections Actions
  toggleConnection: (platform: 'facebook' | 'instagram', pageName?: string) => void;
  connectMetaPage: (platform: 'facebook' | 'instagram', pageId: string, pageName: string) => Promise<void>;
  disconnectMetaPage: (platform: 'facebook' | 'instagram') => Promise<void>;
  getFacebookAuthUrl: () => Promise<string>;
  fetchFacebookPages: () => Promise<{ id: string; name: string }[]>;
  linkFacebookPage: (pageId: string) => Promise<void>;
  
  // Chat Actions
  setActiveConversationId: (id: string | null) => void;
  sendManualReply: (text: string) => void;
  toggleConversationAI: (conversationId: string) => void;
  closeConversation: (conversationId: string) => void;
  simulateIncomingMessage: (text?: string, fromCustomer?: string) => void;
  approveDraftReply: (conversationId: string, text: string) => void;
  discardDraftReply: (conversationId: string) => void;
  
  // Knowledge Base Actions
  addKBText: (title: string, content: string) => void;
  uploadKBFile: (name: string, type: 'pdf' | 'docx' | 'txt', content: string) => void;
  deleteKBDocument: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultOrgs: Organization[] = [
  {
    id: 'org-abc',
    name: 'ABC Store',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&auto=format&fit=crop&q=80',
    timezone: 'GMT+06:00',
    language: 'English',
    aiEnabled: true,
    aiMode: 'Automatic',
    model: 'Gemini',
    prompt: `You are customer support assistant for ABC Store.
Always be polite.
Don't discuss politics.
Answer questions accurately based on our knowledge base.
If you don't know the answer, politely tell them to leave their email address and a human agent will get back to them.`,
    temperature: 0.7,
    maxTokens: 250,
    team: [
      { id: 'u1', name: 'Mahmud', email: 'mahmud@autoreply.ai', role: 'owner', status: 'active' },
      { id: 'u2', name: 'Sara Miller', email: 'sara@abcstore.com', role: 'member', status: 'active' },
    ],
  },
  {
    id: 'org-xyz',
    name: 'XYZ Agency',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80',
    timezone: 'GMT-05:00',
    language: 'English',
    aiEnabled: true,
    aiMode: 'Draft Only',
    model: 'Claude',
    prompt: `You are an AI representative of XYZ Digital Marketing Agency.
Help customers understand our services (SEO, PPC, Social Media Management).
Keep your tone highly professional and persuasive.`,
    temperature: 0.5,
    maxTokens: 300,
    team: [
      { id: 'u1', name: 'Mahmud', email: 'mahmud@autoreply.ai', role: 'owner', status: 'active' }
    ]
  }
];

const defaultConnections: Connection[] = [
  { platform: 'facebook', connected: true, pageName: 'ABC Store Online', pageId: 'fb-page-1024', lastSync: '5 mins ago', webhookStatus: 'active' },
  { platform: 'instagram', connected: false }
];

const defaultConversations = (orgId: string): Conversation[] => {
  if (orgId === 'org-abc') {
    return [
      {
        id: 'c1',
        name: 'John Doe',
        platform: 'facebook',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        aiEnabled: true,
        status: 'open',
        unread: true,
        lastActivity: '2m ago',
        messages: [
          { id: 'm1_1', sender: 'customer', text: 'Hello! I ordered a jacket yesterday. Can you tell me if it shipped?', timestamp: '10:00 AM' },
          { id: 'm1_2', sender: 'ai', text: 'Hi John! I would be happy to help with that. Let me look up your order. Do you happen to have your order number handy?', timestamp: '10:01 AM' },
          { id: 'm1_3', sender: 'customer', text: 'Yes, it is #ABC-84920.', timestamp: '10:03 AM' },
          { id: 'm1_4', sender: 'ai', text: 'Thank you! Checking order #ABC-84920... According to our shipment logs, your jacket has been dispatched and is currently in transit with DHL. It is estimated to arrive tomorrow afternoon! You can track it here: dhl.com/track/ABC-84920.', timestamp: '10:04 AM' },
          { id: 'm1_5', sender: 'customer', text: 'Awesome! That is super fast. Thanks!', timestamp: '2m ago' }
        ]
      },
      {
        id: 'c2',
        name: 'Emily Watson',
        platform: 'instagram',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        aiEnabled: true,
        status: 'open',
        unread: false,
        lastActivity: '15m ago',
        messages: [
          { id: 'm2_1', sender: 'customer', text: 'Do you guys ship to Canada? I want to buy the boots.', timestamp: '9:45 AM' },
          { id: 'm2_2', sender: 'ai-draft', text: 'Hello Emily! Yes, ABC Store ships to Canada! Standard shipping takes 5-9 business days and costs $15, while express delivery takes 2-4 business days for $30. Shipping is free on orders over $150!', timestamp: '9:46 AM', isDraft: true }
        ]
      },
      {
        id: 'c3',
        name: 'Michael Chang',
        platform: 'facebook',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        aiEnabled: false,
        status: 'open',
        unread: false,
        lastActivity: '1h ago',
        messages: [
          { id: 'm3_1', sender: 'customer', text: 'Are your items true to size? Interested in the linen shirts.', timestamp: '8:30 AM' },
          { id: 'm3_2', sender: 'user', text: 'Hi Michael! Our linen shirts have a slightly relaxed, boxy fit. If you prefer a tailored look, we recommend sizing down one size. Otherwise, stick to your regular size. Here is our sizing chart link: abcstore.com/size-guide', timestamp: '8:35 AM' }
        ]
      }
    ];
  } else {
    return [
      {
        id: 'c_xyz_1',
        name: 'Sophia Loren',
        platform: 'facebook',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
        aiEnabled: true,
        status: 'open',
        unread: true,
        lastActivity: '10m ago',
        messages: [
          { id: 'm_xyz_1_1', sender: 'customer', text: 'Hi! What are your SEO packages pricing?', timestamp: '10:15 AM' },
          { id: 'm_xyz_1_2', sender: 'ai-draft', text: 'Hello Sophia! We offer three core SEO tiers: 1) Kickstart ($1,200/mo) for local SEO & audits, 2) Growth ($2,500/mo) for competitor analysis & keyword ranking, and 3) Enterprise (Custom pricing) for large e-commerce platforms. Would you like to schedule a free 15-minute consultation to find the best fit?', timestamp: '10:16 AM', isDraft: true }
        ]
      }
    ];
  }
};

const defaultKB: KBDocument[] = [
  { id: 'kb1', name: 'Shipping Policy.txt', type: 'txt', content: 'ABC Store ships worldwide. Domestic shipping (USA) is free on orders over $75. Standard shipping costs $5.99 and takes 3-5 days. International shipping to Canada is $15, free on orders over $150. Other international locations cost $25 flat rate and take 7-14 days. Express shipping options are available at checkout.', uploadDate: '2026-06-15', status: 'ready' },
  { id: 'kb2', name: 'Refund & Returns.txt', type: 'txt', content: 'We offer a 30-day return policy for all unworn, unwashed clothing items with tags still attached. Customers are responsible for return shipping costs unless the item was damaged or incorrect. Refunds are processed within 5-7 business days back to the original payment method once the package is received.', uploadDate: '2026-06-18', status: 'ready' },
  { id: 'kb3', name: 'Store Opening Hours.txt', type: 'txt', content: 'ABC Store locations are open Monday to Saturday from 9:00 AM to 8:00 PM (EST). We are closed on Sundays and national holidays (New Year, Christmas, Thanksgiving). Online customer support is monitored by AI 24/7, with human support staff checking in during business hours.', uploadDate: '2026-06-20', status: 'ready' }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('replyai_user');
    return saved ? JSON.parse(saved) : null;
  });



  // Organizations List State
  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('replyai_orgs');
    return saved ? JSON.parse(saved) : defaultOrgs;
  });

  // Active Org State
  const [activeOrgId, setActiveOrgId] = useState<string | null>(() => {
    const saved = localStorage.getItem('replyai_active_org_id');
    return saved || 'org-abc';
  });

  // Connections State
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('replyai_connections');
    return saved ? JSON.parse(saved) : defaultConnections;
  });

  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('replyai_conversations');
    return saved ? JSON.parse(saved) : defaultConversations('org-abc');
  });

  // Knowledge Base State
  const [knowledgeBase, setKnowledgeBase] = useState<KBDocument[]>(() => {
    const saved = localStorage.getItem('replyai_kb');
    return saved ? JSON.parse(saved) : defaultKB;
  });

  // Billing Metrics State
  const [billing, setBilling] = useState<{
    tier: string;
    messagesUsed: number;
    messageLimit: number;
    renewalDate: string;
  }>(() => {
    const saved = localStorage.getItem('replyai_billing');
    return saved ? JSON.parse(saved) : {
      tier: 'Pro Plan',
      messagesUsed: 254,
      messageLimit: 1000,
      renewalDate: '2026-08-01'
    };
  });

  // UI Simulation States
  const [typingConversationId, setTypingConversationId] = useState<string | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('c1');

  // Sync to local storage
  useEffect(() => {
    if (user) localStorage.setItem('replyai_user', JSON.stringify(user));
    else localStorage.removeItem('replyai_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('replyai_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    if (activeOrgId) {
      localStorage.setItem('replyai_active_org_id', activeOrgId);
    }
  }, [activeOrgId]);

  useEffect(() => {
    localStorage.setItem('replyai_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('replyai_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('replyai_kb', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  useEffect(() => {
    localStorage.setItem('replyai_billing', JSON.stringify(billing));
  }, [billing]);

  // Sync conversations when switching organizations
  const selectOrg = (id: string) => {
    setActiveOrgId(id);
    const loadedConversations = localStorage.getItem(`replyai_conversations_${id}`);
    if (loadedConversations) {
      const parsed = JSON.parse(loadedConversations);
      setConversations(parsed);
      if (parsed.length > 0) setActiveConversationId(parsed[0].id);
      else setActiveConversationId(null);
    } else {
      const fresh = defaultConversations(id);
      setConversations(fresh);
      if (fresh.length > 0) setActiveConversationId(fresh[0].id);
      else setActiveConversationId(null);
    }
  };

  // Keep conversations cached per organization
  useEffect(() => {
    if (activeOrgId) {
      localStorage.setItem(`replyai_conversations_${activeOrgId}`, JSON.stringify(conversations));
    }
  }, [conversations, activeOrgId]);

  // Actions: User Auth
  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!password) {
      throw new Error('Password is required');
    }
    const tokenData = await api.login(email, password);
    setTokens(tokenData.access, tokenData.refresh);
    
    // Fetch profile
    const profile = await api.getProfile();
    const hasOnboarded = localStorage.getItem(`replyai_onboarded_${email}`) === 'true';
    
    setUser({
      id: profile.id,
      name: profile.full_name || 'No Name',
      email: profile.email,
      avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      phoneNumber: profile.phone_number,
      onboardingCompleted: hasOnboarded,
      notifications: { newMessages: true, aiReplies: true, weeklyDigest: false }
    });
    return true;
  };

  const signup = async (email: string, name: string, password?: string): Promise<boolean> => {
    if (!password) {
      throw new Error('Password is required');
    }
    await api.register(email, password, name);
    return true;
  };

  const logout = async () => {
    const refresh = getRefreshToken();
    if (refresh) {
      try {
        await api.logout(refresh);
      } catch (err) {
        console.warn('Backend logout failed', err);
      }
    }
    clearTokens();
    setUser(null);
    localStorage.removeItem('replyai_user');
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      
      // Persist onboarding status to localStorage keyed by email
      if (updates.onboardingCompleted !== undefined) {
        localStorage.setItem(`replyai_onboarded_${prev.email}`, String(updates.onboardingCompleted));
      }
      
      // Patch on the backend!
      if (updates.name !== undefined || updates.avatar !== undefined || updates.phoneNumber !== undefined) {
        const patchData: any = {};
        if (updates.name !== undefined) patchData.full_name = updates.name;
        if (updates.avatar !== undefined) patchData.avatar = updates.avatar;
        if (updates.phoneNumber !== undefined) patchData.phone_number = updates.phoneNumber;
        
        api.updateProfile(patchData)
          .then((updatedProfile) => {
            console.log('Profile successfully updated on backend', updatedProfile);
          })
          .catch((err) => {
            console.error('Failed to update profile on backend', err);
          });
      }
      
      return updated;
    });
  };

  // Load latest user profile on mount and force log out on stale/mock sessions
  useEffect(() => {
    const token = getAccessToken();
    if (!token && user) {
      logout();
      return;
    }
    
    if (token) {
      api.getProfile()
        .then((profile) => {
          const email = profile.email;
          const hasOnboarded = localStorage.getItem(`replyai_onboarded_${email}`) === 'true';
          
          setUser({
            id: profile.id,
            name: profile.full_name || 'No Name',
            email: profile.email,
            avatar: profile.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            phoneNumber: profile.phone_number,
            onboardingCompleted: hasOnboarded,
            notifications: { newMessages: true, aiReplies: true, weeklyDigest: false }
          });
        })
        .catch((err) => {
          console.error('Failed to load user profile from backend on mount', err);
          logout();
        });
    }
  }, []);

  // Actions: Organizations
  const createOrg = (name: string, logoUrl?: string): string => {
    const newId = 'org-' + Date.now();
    const newOrg: Organization = {
      id: newId,
      name,
      logo: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      timezone: 'GMT+06:00',
      language: 'English',
      aiEnabled: true,
      aiMode: 'Automatic',
      model: 'Gemini',
      prompt: `You are customer support assistant for ${name}.\nAlways be polite.\nAnswer customer questions based on our knowledge base documents.`,
      temperature: 0.7,
      maxTokens: 250,
      team: [{ id: user?.id || 'u1', name: user?.name || 'Mahmud', email: user?.email || 'mahmud@autoreply.ai', role: 'owner', status: 'active' }]
    };
    setOrganizations(prev => [...prev, newOrg]);
    setActiveOrgId(newId);
    setConversations([]);
    setActiveConversationId(null);
    return newId;
  };

  const updateOrgSettings = (updates: Partial<Organization>) => {
    setOrganizations(prev => prev.map(org => {
      if (org.id === activeOrgId) {
        return { ...org, ...updates };
      }
      return org;
    }));
  };

  const inviteTeamMember = (email: string, name: string, role: 'owner' | 'member') => {
    setOrganizations(prev => prev.map(org => {
      if (org.id === activeOrgId) {
        const newMember: TeamMember = {
          id: 'member-' + Date.now(),
          name,
          email,
          role,
          status: 'invited'
        };
        return { ...org, team: [...org.team, newMember] };
      }
      return org;
    }));
  };

  const removeTeamMember = (id: string) => {
    setOrganizations(prev => prev.map(org => {
      if (org.id === activeOrgId) {
        return { ...org, team: org.team.filter(m => m.id !== id) };
      }
      return org;
    }));
  };

  // Actions: Connections
  const toggleConnection = (platform: 'facebook' | 'instagram', pageName?: string) => {
    setConnections(prev => prev.map(c => {
      if (c.platform === platform) {
        return {
          ...c,
          connected: !c.connected,
          pageName: !c.connected ? pageName || (platform === 'facebook' ? 'ABC Store Fanpage' : '@abcstore_global') : undefined,
          pageId: !c.connected ? `${platform}-page-${Math.floor(Math.random() * 10000)}` : undefined,
          lastSync: !c.connected ? 'Just now' : undefined,
          webhookStatus: !c.connected ? 'active' : undefined
        };
      }
      return c;
    }));
  };

  const connectMetaPage = async (platform: 'facebook' | 'instagram', pageId: string, pageName: string) => {
    setConnections(prev => prev.map(c => {
      if (c.platform === platform) {
        return {
          ...c,
          connected: true,
          pageName,
          pageId,
          lastSync: 'Just now',
          webhookStatus: 'active'
        };
      }
      return c;
    }));
  };

  const disconnectMetaPage = async (platform: 'facebook' | 'instagram') => {
    setConnections(prev => prev.map(c => {
      if (c.platform === platform) {
        return {
          ...c,
          connected: false,
          pageName: undefined,
          pageId: undefined,
          lastSync: undefined,
          webhookStatus: undefined
        };
      }
      return c;
    }));
  };

  const getFacebookAuthUrl = async (): Promise<string> => {
    try {
      const data = await apiRequest('/api/v1/integrations/meta/connect/');
      return data.authorization_url;
    } catch (e) {
      console.warn('Backend API connection failed, returning mock auth URL', e);
    }
    // Fallback Mock OAuth URL
    return window.location.origin + window.location.pathname + '#/mock-facebook-oauth';
  };

  const fetchFacebookPages = async (): Promise<{ id: string; name: string }[]> => {
    try {
      const data = await apiRequest('/api/v1/integrations/meta/pages/');
      return data;
    } catch (e) {
      console.warn('Backend API connection failed, returning mock pages', e);
    }
    // Fallback Mock Pages
    return [
      { id: 'fb-page-101', name: 'ABC Store Online' },
      { id: 'fb-page-202', name: 'Mahmud\'s Tech Corner' },
      { id: 'fb-page-303', name: 'Global Fashion Co' }
    ];
  };

  const linkFacebookPage = async (pageId: string): Promise<void> => {
    try {
      await apiRequest('/api/v1/integrations/meta/select-page/', {
        method: 'POST',
        body: JSON.stringify({ page_id: pageId })
      });
    } catch (e) {
      console.warn('Backend API connection failed, simulating success locally', e);
    }
  };

  // Helper: Get AI Response based on Prompt & Knowledge base
  const generateMockAIResponse = (customerQuery: string, currentOrg: Organization): string => {
    const query = customerQuery.toLowerCase();
    
    // Scan Knowledge Base
    let matchingKBContent = '';
    for (const doc of knowledgeBase) {
      if (doc.status === 'ready') {
        const sentences = doc.content.split('. ');
        const matched = sentences.filter(s => {
          const words = s.toLowerCase().split(' ');
          return words.some(w => w.length > 3 && query.includes(w));
        });
        if (matched.length > 0) {
          matchingKBContent += matched.join('. ') + '. ';
        }
      }
    }

    const hasClosedKeyword = query.includes('hours') || query.includes('open') || query.includes('close') || query.includes('sunday');
    const hasShippingKeyword = query.includes('ship') || query.includes('delivery') || query.includes('shipping') || query.includes('canada');
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

    // Apply model adjustments
    if (currentOrg.model === 'Claude') {
      response = `Greetings! Thank you for contacting our customer service desk today. \n\n${response} \n\nPlease let me know if there is anything else I can do to make your experience more delightful.`;
    } else if (currentOrg.model === 'Gemini') {
      response = `Hey there! Glad to assist you today. Here is the information you requested:\n\n• ${response.replace('. ', '\n• ')}\n\nHope this helps! Let me know if you need anything else.`;
    } else if (currentOrg.model === 'GPT-5.5') {
      response = `[AI Auto-Response] ${response} Please reply if you require further assistance.`;
    }

    return response;
  };

  // Actions: Conversations & Simulation
  const sendManualReply = (text: string) => {
    if (!activeConversationId) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text,
      timestamp
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          unread: false,
          lastActivity: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    }));

    // Increment billing analytics
    setBilling(prev => ({
      ...prev,
      messagesUsed: Math.min(prev.messagesUsed + 1, prev.messageLimit)
    }));
  };

  const toggleConversationAI = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, aiEnabled: !conv.aiEnabled };
      }
      return conv;
    }));
  };

  const closeConversation = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return { ...conv, status: conv.status === 'open' ? 'closed' : 'open' };
      }
      return conv;
    }));
  };

  const approveDraftReply = (conversationId: string, text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const cleanedMessages = conv.messages.filter(m => !m.isDraft);
        const approvedMsg: Message = {
          id: 'msg-' + Date.now(),
          sender: 'ai', // Mark as sent by AI now
          text,
          timestamp
        };
        return {
          ...conv,
          lastActivity: 'Just now',
          messages: [...cleanedMessages, approvedMsg]
        };
      }
      return conv;
    }));

    setBilling(prev => ({
      ...prev,
      messagesUsed: Math.min(prev.messagesUsed + 1, prev.messageLimit)
    }));
  };

  const discardDraftReply = (conversationId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: conv.messages.filter(m => !m.isDraft)
        };
      }
      return conv;
    }));
  };

  const simulateIncomingMessage = (text?: string, fromCustomer?: string) => {
    const randomQueries = [
      "Hello! Are you guys open on Sunday?",
      "Hi support, do you ship to Canada? I want to order some items.",
      "Hello! What is your return policy? I bought a shirt that doesn't fit.",
      "Hey, is it possible to speak to a human representative?",
      "Hi, do you have any promo codes available for new shoppers?"
    ];

    const randomNames = ["Sara Jenkins", "David Miller", "Alice Cooper", "Robert Chen", "Elena Rostova"];
    
    const org = organizations.find(o => o.id === activeOrgId) || defaultOrgs[0];
    const incomingText = text || randomQueries[Math.floor(Math.random() * randomQueries.length)];
    const customerName = fromCustomer || randomNames[Math.floor(Math.random() * randomNames.length)];
    
    // Find if customer conversation already exists or create new one
    let targetConv = conversations.find(c => c.name.toLowerCase() === customerName.toLowerCase());
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let targetId = '';
    const incomingMsg: Message = {
      id: 'msg-in-' + Date.now(),
      sender: 'customer',
      text: incomingText,
      timestamp
    };

    if (targetConv) {
      targetId = targetConv.id;
      setConversations(prev => prev.map(conv => {
        if (conv.id === targetId) {
          return {
            ...conv,
            unread: true,
            status: 'open',
            lastActivity: 'Just now',
            messages: [...conv.messages, incomingMsg]
          };
        }
        return conv;
      }));
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
        messages: [incomingMsg]
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(targetId);
    }

    // Trigger AI response generation
    const currentConvState = conversations.find(c => c.id === targetId) || { aiEnabled: true };
    const canUseAI = org.aiEnabled && currentConvState.aiEnabled;

    if (canUseAI) {
      setTypingConversationId(targetId);
      
      // Delay typing simulation for a premium feel
      setTimeout(() => {
        const aiText = generateMockAIResponse(incomingText, org);
        const aiMsg: Message = {
          id: 'msg-ai-' + Date.now(),
          sender: org.aiMode === 'Automatic' ? 'ai' : 'ai-draft',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isDraft: org.aiMode === 'Draft Only'
        };

        setConversations(prev => prev.map(conv => {
          if (conv.id === targetId) {
            // Remove previous draft if any and add the new one or regular AI message
            const filteredMessages = conv.messages.filter(m => !m.isDraft);
            return {
              ...conv,
              unread: org.aiMode === 'Draft Only' ? conv.unread : false, // Auto-reply marks as read
              messages: [...filteredMessages, aiMsg]
            };
          }
          return conv;
        }));

        setTypingConversationId(null);
        
        // Track stats
        setBilling(prev => ({
          ...prev,
          messagesUsed: Math.min(prev.messagesUsed + (org.aiMode === 'Automatic' ? 1 : 0), prev.messageLimit)
        }));
      }, 1500);
    }
  };

  // Actions: Knowledge Base
  const addKBText = (title: string, content: string) => {
    const newDoc: KBDocument = {
      id: 'kb-' + Date.now(),
      name: title.endsWith('.txt') ? title : `${title}.txt`,
      type: 'text',
      content,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'ready'
    };
    setKnowledgeBase(prev => [newDoc, ...prev]);
  };

  const uploadKBFile = (name: string, type: 'pdf' | 'docx' | 'txt', content: string) => {
    const newDoc: KBDocument = {
      id: 'kb-' + Date.now(),
      name,
      type,
      content,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'indexing' // Simulate indexing state
    };
    setKnowledgeBase(prev => [newDoc, ...prev]);

    // Simulate completion of document indexing
    setTimeout(() => {
      setKnowledgeBase(prev => prev.map(doc => {
        if (doc.id === newDoc.id) {
          return { ...doc, status: 'ready' };
        }
        return doc;
      }));
    }, 2500);
  };

  const deleteKBDocument = (id: string) => {
    setKnowledgeBase(prev => prev.filter(doc => doc.id !== id));
  };



  return (
    <AppContext.Provider value={{
      user,
      organizations,
      activeOrgId,
      connections,
      conversations,
      knowledgeBase,
      billing,
      typingConversationId,
      activeConversationId,
      
      login,
      signup,
      logout,
      updateUser,
      
      createOrg,
      selectOrg,
      updateOrgSettings,
      inviteTeamMember,
      removeTeamMember,
      
      toggleConnection,
      connectMetaPage,
      disconnectMetaPage,
      getFacebookAuthUrl,
      fetchFacebookPages,
      linkFacebookPage,
      
      setActiveConversationId,
      sendManualReply,
      toggleConversationAI,
      closeConversation,
      simulateIncomingMessage,
      approveDraftReply,
      discardDraftReply,
      
      addKBText,
      uploadKBFile,
      deleteKBDocument
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
