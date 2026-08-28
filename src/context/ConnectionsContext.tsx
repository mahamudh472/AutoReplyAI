import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Connection, MetaPage } from '../types/connections';
import { DEFAULT_CONNECTIONS } from '../constants/defaults';
import { api } from '../services';

export interface ConnectionsContextType {
  connections: Connection[];
  toggleConnection: (platform: 'facebook' | 'instagram', pageName?: string) => void;
  connectMetaPage: (platform: 'facebook' | 'instagram', pageId: string, pageName: string) => Promise<void>;
  disconnectMetaPage: (platform: 'facebook' | 'instagram') => Promise<void>;
  getFacebookAuthUrl: () => Promise<string>;
  fetchFacebookPages: () => Promise<MetaPage[]>;
  linkFacebookPage: (pageId: string) => Promise<void>;
}

const ConnectionsContext = createContext<ConnectionsContextType | undefined>(undefined);

export const ConnectionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('replyai_connections');
    return saved ? JSON.parse(saved) : DEFAULT_CONNECTIONS;
  });

  useEffect(() => {
    localStorage.setItem('replyai_connections', JSON.stringify(connections));
  }, [connections]);

  const toggleConnection = (platform: 'facebook' | 'instagram', pageName?: string) => {
    setConnections((prev) =>
      prev.map((c) => {
        if (c.platform === platform) {
          return {
            ...c,
            connected: !c.connected,
            pageName: !c.connected
              ? pageName || (platform === 'facebook' ? 'ABC Store Fanpage' : '@abcstore_global')
              : undefined,
            pageId: !c.connected ? `${platform}-page-${Math.floor(Math.random() * 10000)}` : undefined,
            lastSync: !c.connected ? 'Just now' : undefined,
            webhookStatus: !c.connected ? 'active' : undefined,
          };
        }
        return c;
      })
    );
  };

  const connectMetaPage = async (platform: 'facebook' | 'instagram', pageId: string, pageName: string) => {
    setConnections((prev) =>
      prev.map((c) => {
        if (c.platform === platform) {
          return {
            ...c,
            connected: true,
            pageName,
            pageId,
            lastSync: 'Just now',
            webhookStatus: 'active',
          };
        }
        return c;
      })
    );
  };

  const disconnectMetaPage = async (platform: 'facebook' | 'instagram') => {
    setConnections((prev) =>
      prev.map((c) => {
        if (c.platform === platform) {
          return {
            ...c,
            connected: false,
            pageName: undefined,
            pageId: undefined,
            lastSync: undefined,
            webhookStatus: undefined,
          };
        }
        return c;
      })
    );
  };

  const getFacebookAuthUrl = (): Promise<string> => {
    return api.getFacebookAuthUrl();
  };

  const fetchFacebookPages = (): Promise<MetaPage[]> => {
    return api.fetchFacebookPages();
  };

  const linkFacebookPage = (pageId: string): Promise<void> => {
    return api.linkFacebookPage(pageId);
  };

  return (
    <ConnectionsContext.Provider
      value={{
        connections,
        toggleConnection,
        connectMetaPage,
        disconnectMetaPage,
        getFacebookAuthUrl,
        fetchFacebookPages,
        linkFacebookPage,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }
  return context;
};
