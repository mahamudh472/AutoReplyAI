import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { OrgProvider, useOrg } from './OrgContext';
import { ConnectionsProvider, useConnections } from './ConnectionsContext';
import { BillingProvider, useBilling } from './BillingContext';
import { ChatProvider, useChat } from './ChatContext';

// Re-export domain contexts and hooks
export * from './AuthContext';
export * from './OrgContext';
export * from './ConnectionsContext';
export * from './BillingContext';
export * from './ChatContext';

// Re-export common types
export * from '../types';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <OrgProvider>
        <BillingProvider>
          <ConnectionsProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </ConnectionsProvider>
        </BillingProvider>
      </OrgProvider>
    </AuthProvider>
  );
};

export const useApp = () => {
  const auth = useAuth();
  const org = useOrg();
  const connections = useConnections();
  const billing = useBilling();
  const chat = useChat();

  return {
    // Auth & User
    user: auth.user,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    updateUser: auth.updateUser,

    // Organization
    organizations: org.organizations,
    activeOrgId: org.activeOrgId,
    createOrg: org.createOrg,
    selectOrg: org.selectOrg,
    updateOrgSettings: org.updateOrgSettings,
    inviteTeamMember: org.inviteTeamMember,
    removeTeamMember: org.removeTeamMember,

    // Connections & Meta
    connections: connections.connections,
    toggleConnection: connections.toggleConnection,
    connectMetaPage: connections.connectMetaPage,
    disconnectMetaPage: connections.disconnectMetaPage,
    getFacebookAuthUrl: connections.getFacebookAuthUrl,
    fetchFacebookPages: connections.fetchFacebookPages,
    linkFacebookPage: connections.linkFacebookPage,

    // Billing
    billing: billing.billing,

    // Chat & Conversations
    conversations: chat.conversations,
    activeConversationId: chat.activeConversationId,
    typingConversationId: chat.typingConversationId,
    knowledgeBase: chat.knowledgeBase,
    setActiveConversationId: chat.setActiveConversationId,
    sendManualReply: chat.sendManualReply,
    toggleConversationAI: chat.toggleConversationAI,
    closeConversation: chat.closeConversation,
    simulateIncomingMessage: chat.simulateIncomingMessage,
    approveDraftReply: chat.approveDraftReply,
    discardDraftReply: chat.discardDraftReply,
    addKBText: chat.addKBText,
    uploadKBFile: chat.uploadKBFile,
    deleteKBDocument: chat.deleteKBDocument,
  };
};
