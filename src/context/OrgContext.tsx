import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Organization, TeamMember } from '../types/organization';
import { DEFAULT_ORGS } from '../constants/defaults';
import { useAuth } from './AuthContext';

export interface OrgContextType {
  organizations: Organization[];
  activeOrgId: string | null;
  createOrg: (name: string, logoUrl?: string) => string;
  selectOrg: (id: string) => void;
  updateOrgSettings: (updates: Partial<Organization>) => void;
  inviteTeamMember: (email: string, name: string, role: 'owner' | 'member') => void;
  removeTeamMember: (id: string) => void;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [organizations, setOrganizations] = useState<Organization[]>(() => {
    const saved = localStorage.getItem('replyai_orgs');
    return saved ? JSON.parse(saved) : DEFAULT_ORGS;
  });

  const [activeOrgId, setActiveOrgId] = useState<string | null>(() => {
    const saved = localStorage.getItem('replyai_active_org_id');
    return saved || 'org-abc';
  });

  useEffect(() => {
    localStorage.setItem('replyai_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    if (activeOrgId) {
      localStorage.setItem('replyai_active_org_id', activeOrgId);
    }
  }, [activeOrgId]);

  const selectOrg = (id: string) => {
    setActiveOrgId(id);
  };

  const createOrg = (name: string, logoUrl?: string): string => {
    const newId = 'org-' + Date.now();
    const newOrg: Organization = {
      id: newId,
      name,
      logo:
        logoUrl ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      timezone: 'GMT+06:00',
      language: 'English',
      aiEnabled: true,
      aiMode: 'Automatic',
      model: 'Gemini',
      prompt: `You are customer support assistant for ${name}.\nAlways be polite.\nAnswer customer questions based on our knowledge base documents.`,
      temperature: 0.7,
      maxTokens: 250,
      team: [
        {
          id: user?.id || 'u1',
          name: user?.name || 'Mahmud',
          email: user?.email || 'mahmud@autoreply.ai',
          role: 'owner',
          status: 'active',
        },
      ],
    };

    setOrganizations((prev) => [...prev, newOrg]);
    setActiveOrgId(newId);
    return newId;
  };

  const updateOrgSettings = (updates: Partial<Organization>) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === activeOrgId) {
          return { ...org, ...updates };
        }
        return org;
      })
    );
  };

  const inviteTeamMember = (email: string, name: string, role: 'owner' | 'member') => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === activeOrgId) {
          const newMember: TeamMember = {
            id: 'member-' + Date.now(),
            name,
            email,
            role,
            status: 'invited',
          };
          return { ...org, team: [...org.team, newMember] };
        }
        return org;
      })
    );
  };

  const removeTeamMember = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === activeOrgId) {
          return { ...org, team: org.team.filter((m) => m.id !== id) };
        }
        return org;
      })
    );
  };

  return (
    <OrgContext.Provider
      value={{
        organizations,
        activeOrgId,
        createOrg,
        selectOrg,
        updateOrgSettings,
        inviteTeamMember,
        removeTeamMember,
      }}
    >
      {children}
    </OrgContext.Provider>
  );
};

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    throw new Error('useOrg must be used within an OrgProvider');
  }
  return context;
};
