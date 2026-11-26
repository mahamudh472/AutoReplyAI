import type { Connection } from '../types/connections';
import type { Conversation } from '../types/chat';
import type { KBDocument } from '../types/knowledgeBase';
import type { BillingState } from '../types/billing';

export const DEFAULT_CONNECTIONS: Connection[] = [
  {
    platform: 'facebook',
    connected: true,
    pageName: 'ABC Store Online',
    pageId: 'fb-page-1024',
    lastSync: '5 mins ago',
    webhookStatus: 'active',
  },
  { platform: 'instagram', connected: false },
];

export const getDefaultConversations = (orgId: string): Conversation[] => {
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
          { id: 'm1_5', sender: 'customer', text: 'Awesome! That is super fast. Thanks!', timestamp: '2m ago' },
        ],
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
          { id: 'm2_2', sender: 'ai-draft', text: 'Hello Emily! Yes, ABC Store ships to Canada! Standard shipping takes 5-9 business days and costs $15, while express delivery takes 2-4 business days for $30. Shipping is free on orders over $150!', timestamp: '9:46 AM', isDraft: true },
        ],
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
          { id: 'm3_2', sender: 'user', text: 'Hi Michael! Our linen shirts have a slightly relaxed, boxy fit. If you prefer a tailored look, we recommend sizing down one size. Otherwise, stick to your regular size. Here is our sizing chart link: abcstore.com/size-guide', timestamp: '8:35 AM' },
        ],
      },
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
          { id: 'm_xyz_1_2', sender: 'ai-draft', text: 'Hello Sophia! We offer three core SEO tiers: 1) Kickstart ($1,200/mo) for local SEO & audits, 2) Growth ($2,500/mo) for competitor analysis & keyword ranking, and 3) Enterprise (Custom pricing) for large e-commerce platforms. Would you like to schedule a free 15-minute consultation to find the best fit?', timestamp: '10:16 AM', isDraft: true },
        ],
      },
    ];
  }
};

export const DEFAULT_KB: KBDocument[] = [
  {
    id: 'kb1',
    name: 'Shipping Policy.txt',
    type: 'txt',
    content: 'ABC Store ships worldwide. Domestic shipping (USA) is free on orders over $75. Standard shipping costs $5.99 and takes 3-5 days. International shipping to Canada is $15, free on orders over $150. Other international locations cost $25 flat rate and take 7-14 days. Express shipping options are available at checkout.',
    uploadDate: '2026-06-15',
    status: 'ready',
  },
  {
    id: 'kb2',
    name: 'Refund & Returns.txt',
    type: 'txt',
    content: 'We offer a 30-day return policy for all unworn, unwashed clothing items with tags still attached. Customers are responsible for return shipping costs unless the item was damaged or incorrect. Refunds are processed within 5-7 business days back to the original payment method once the package is received.',
    uploadDate: '2026-06-18',
    status: 'ready',
  },
  {
    id: 'kb3',
    name: 'Store Opening Hours.txt',
    type: 'txt',
    content: 'ABC Store locations are open Monday to Saturday from 9:00 AM to 8:00 PM (EST). We are closed on Sundays and national holidays (New Year, Christmas, Thanksgiving). Online customer support is monitored by AI 24/7, with human support staff checking in during business hours.',
    uploadDate: '2026-06-20',
    status: 'ready',
  },
];

export const DEFAULT_BILLING: BillingState = {
  tier: 'Pro Plan',
  messagesUsed: 254,
  messageLimit: 1000,
  renewalDate: '2026-08-01',
};
