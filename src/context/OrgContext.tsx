import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Organization,
  TeamMember,
  OrganizationSubscription,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
} from '../types/organization';
import { DEFAULT_ORGS } from '../constants/defaults';
import { organizationService } from '../services/organizationService';
import { useAuth } from './AuthContext';

export interface OrgContextType {
  organizations: Organization[];
  activeOrgId: string | null;
  activeOrg: Organization | undefined;
  subscription: OrganizationSubscription | null;
  isLoading: boolean;
  isSaving: boolean;
  createOrg: (data: CreateOrganizationPayload | string, logoUrl?: string) => Promise<string>;
  selectOrg: (id: string) => void;
  updateOrgSettings: (updates: UpdateOrganizationPayload | Partial<Organization>) => Promise<Organization | undefined>;
  uploadOrgLogo: (file: File) => Promise<string | undefined>;
  removeOrgLogo: () => Promise<void>;
  deleteOrg: (id?: string) => Promise<boolean>;
  refreshOrganizations: () => Promise<void>;
  refreshActiveOrg: () => Promise<void>;
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
    return saved || (DEFAULT_ORGS[0]?.id ?? 'org-abc');
  });

  const [subscription, setSubscription] = useState<OrganizationSubscription | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync to local storage as client cache
  useEffect(() => {
    localStorage.setItem('replyai_orgs', JSON.stringify(organizations));
  }, [organizations]);

  useEffect(() => {
    if (activeOrgId) {
      localStorage.setItem('replyai_active_org_id', activeOrgId);
    }
  }, [activeOrgId]);

  // Fetch list of organizations from backend
  const refreshOrganizations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await organizationService.listOrganizations();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map((item) => ({
          ...item,
          logo: item.logo_url || item.logo || '',
          language: item.default_language || item.language || 'English',
          timezone: item.timezone || 'GMT+06:00',
          team: item.team || [],
        }));
        setOrganizations(normalized);
        if (!activeOrgId || !normalized.some((o) => o.id === activeOrgId)) {
          setActiveOrgId(normalized[0].id);
        }
      }
    } catch (err) {
      console.warn('Could not fetch organizations from backend, using cached state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeOrgId]);

  // Fetch details and subscription for the active organization
  const refreshActiveOrg = useCallback(async () => {
    if (!activeOrgId) return;
    try {
      // 1. Fetch details
      const orgDetails = await organizationService.getOrganization(activeOrgId);
      if (orgDetails && orgDetails.id) {
        const normalizedOrg: Organization = {
          ...orgDetails,
          logo: orgDetails.logo_url || orgDetails.logo || '',
          language: orgDetails.default_language || orgDetails.language || 'English',
          timezone: orgDetails.timezone || 'GMT+06:00',
          team: orgDetails.team || [],
        };
        setOrganizations((prev) =>
          prev.map((o) => (o.id === activeOrgId ? { ...o, ...normalizedOrg } : o))
        );
      }
    } catch (err) {
      console.warn(`Could not fetch details for org ${activeOrgId}:`, err);
    }

    try {
      // 2. Fetch subscription
      const subData = await organizationService.getSubscription(activeOrgId);
      if (subData) {
        setSubscription(subData);
      }
    } catch (err) {
      console.warn(`Could not fetch subscription for org ${activeOrgId}:`, err);
      // Fallback default subscription
      setSubscription({
        plan_name: 'Starter Plan',
        status: 'active',
        billing_cycle: 'monthly',
        features: {
          max_messages: 10000,
          used_messages: 450,
          max_team_members: 1,
          used_team_members: 1,
          max_connected_accounts: 1,
          used_connected_accounts: 1,
        },
      });
    }
  }, [activeOrgId]);

  useEffect(() => {
    refreshOrganizations();
  }, [refreshOrganizations]);

  useEffect(() => {
    if (activeOrgId) {
      refreshActiveOrg();
    }
  }, [activeOrgId, refreshActiveOrg]);

  const selectOrg = (id: string) => {
    setActiveOrgId(id);
  };

  const createOrg = async (
    data: CreateOrganizationPayload | string,
    logoUrl?: string
  ): Promise<string> => {
    const payload: CreateOrganizationPayload =
      typeof data === 'string'
        ? {
            name: data,
            default_language: 'English',
            timezone: 'GMT+06:00',
          }
        : data;

    try {
      setIsSaving(true);
      const res = await organizationService.createOrganization(payload);
      const newOrg: Organization = {
        ...res,
        logo: res.logo_url || res.logo || logoUrl || '',
        language: res.default_language || res.language || 'English',
        timezone: res.timezone || 'GMT+06:00',
        team: res.team || [
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
      setActiveOrgId(newOrg.id);
      return newOrg.id;
    } catch (err) {
      console.warn('Backend createOrganization failed, fallback locally:', err);
      const newId = 'org-' + Date.now();
      const fallbackOrg: Organization = {
        id: newId,
        name: typeof data === 'string' ? data : data.name,
        slug: typeof data === 'string' ? data.toLowerCase().replace(/\s+/g, '-') : data.slug,
        logo:
          logoUrl ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        timezone: typeof data === 'object' && data.timezone ? data.timezone : 'GMT+06:00',
        language:
          typeof data === 'object' && (data.default_language || (data as any).language)
            ? (data.default_language || (data as any).language)
            : 'English',
        aiEnabled: true,
        aiMode: 'Automatic',
        model: 'Gemini',
        prompt: `You are customer support assistant for ${typeof data === 'string' ? data : data.name}.\nAlways be polite.\nAnswer customer questions based on our knowledge base documents.`,
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
      setOrganizations((prev) => [...prev, fallbackOrg]);
      setActiveOrgId(newId);
      return newId;
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrgSettings = async (
    updates: UpdateOrganizationPayload | Partial<Organization>
  ): Promise<Organization | undefined> => {
    if (!activeOrgId) return;
    try {
      setIsSaving(true);
      const payload: UpdateOrganizationPayload = {
        name: updates.name,
        slug: updates.slug,
        default_language: updates.default_language || updates.language,
        timezone: updates.timezone,
        description: updates.description,
      };

      const res = await organizationService.updateOrganization(activeOrgId, payload);
      const updated: Organization = {
        ...res,
        logo: res.logo_url || res.logo || '',
        language: res.default_language || res.language || 'English',
        timezone: res.timezone || 'GMT+06:00',
      };

      setOrganizations((prev) =>
        prev.map((org) => (org.id === activeOrgId ? { ...org, ...updated, ...updates } : org))
      );
      return updated;
    } catch (err) {
      console.warn('Backend updateOrganization failed, updating local state:', err);
      setOrganizations((prev) =>
        prev.map((org) => {
          if (org.id === activeOrgId) {
            return { ...org, ...updates };
          }
          return org;
        })
      );
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadOrgLogo = async (file: File): Promise<string | undefined> => {
    if (!activeOrgId) return;
    try {
      setIsSaving(true);
      const res = await organizationService.uploadLogo(activeOrgId, file);
      if (res.logo_url) {
        setOrganizations((prev) =>
          prev.map((org) =>
            org.id === activeOrgId ? { ...org, logo: res.logo_url, logo_url: res.logo_url } : org
          )
        );
        return res.logo_url;
      }
    } catch (err) {
      console.warn('Backend uploadLogo failed, generating preview locally:', err);
      const localUrl = URL.createObjectURL(file);
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === activeOrgId ? { ...org, logo: localUrl, logo_url: localUrl } : org
        )
      );
      return localUrl;
    } finally {
      setIsSaving(false);
    }
  };

  const removeOrgLogo = async (): Promise<void> => {
    if (!activeOrgId) return;
    try {
      setIsSaving(true);
      await organizationService.removeLogo(activeOrgId);
      setOrganizations((prev) =>
        prev.map((org) => (org.id === activeOrgId ? { ...org, logo: '', logo_url: null } : org))
      );
    } catch (err) {
      console.warn('Backend removeLogo failed, resetting locally:', err);
      setOrganizations((prev) =>
        prev.map((org) => (org.id === activeOrgId ? { ...org, logo: '', logo_url: null } : org))
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOrg = async (id?: string): Promise<boolean> => {
    const targetId = id || activeOrgId;
    if (!targetId) return false;
    try {
      setIsSaving(true);
      await organizationService.deleteOrganization(targetId);
      const remaining = organizations.filter((o) => o.id !== targetId);
      setOrganizations(remaining);
      if (remaining.length > 0) {
        setActiveOrgId(remaining[0].id);
      } else {
        setActiveOrgId(null);
      }
      return true;
    } catch (err) {
      console.warn(`Backend deleteOrganization failed for ${targetId}, removing locally:`, err);
      const remaining = organizations.filter((o) => o.id !== targetId);
      setOrganizations(remaining);
      if (remaining.length > 0) {
        setActiveOrgId(remaining[0].id);
      } else {
        setActiveOrgId(null);
      }
      return true;
    } finally {
      setIsSaving(false);
    }
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
          return { ...org, team: [...(org.team || []), newMember] };
        }
        return org;
      })
    );
  };

  const removeTeamMember = (id: string) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === activeOrgId) {
          return { ...org, team: (org.team || []).filter((m) => m.id !== id) };
        }
        return org;
      })
    );
  };

  const activeOrg = organizations.find((o) => o.id === activeOrgId) || organizations[0];

  return (
    <OrgContext.Provider
      value={{
        organizations,
        activeOrgId,
        activeOrg,
        subscription,
        isLoading,
        isSaving,
        createOrg,
        selectOrg,
        updateOrgSettings,
        uploadOrgLogo,
        removeOrgLogo,
        deleteOrg,
        refreshOrganizations,
        refreshActiveOrg,
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
