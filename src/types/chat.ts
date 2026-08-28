export type MessageSender = 'customer' | 'user' | 'ai' | 'ai-draft';
export type PlatformType = 'facebook' | 'instagram';
export type ConversationStatus = 'open' | 'closed';

export interface Message {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  isDraft?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  platform: PlatformType;
  avatar: string;
  messages: Message[];
  aiEnabled: boolean;
  status: ConversationStatus;
  unread: boolean;
  lastActivity: string;
}
