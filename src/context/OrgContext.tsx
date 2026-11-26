import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Organization,
  TeamMember,
  TeamInvitation,
  TeamInviteResult,
  OrganizationSubscription,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  InvitableOrganizationRole,
} from '../types/organization';
import { organizationService } from '../services/organizationService';
import { useAuth } from './AuthContext';

export interface OrgContextType {
  organizations: Organization[];
  activeOrgId: string | null;
  activeOrg: Organization | undefined;
  subscription: OrganizationSubscription | null;
  teamMembers: TeamMember[];
  teamInvitations: TeamInvitation[];
  isLoading: boolean;
  isSaving: boolean;
  isTeamLoading: boolean;
  isTeamSaving: boolean;
  orgError: string | null;
  teamError: string | null;
  createOrg: (data: CreateOrganizationPayload | string) => Promise<string>;
  selectOrg: (id: string) => void;
  updateOrgSettings: (
    updates: UpdateOrganizationPayload | Partial<Organization>,
    organizationId?: string
  ) => Promise<Organization | undefined>;
  uploadOrgLogo: (file: File, organizationId?: string) => Promise<string | undefined>;
  removeOrgLogo: (organizationId?: string) => Promise<void>;
  deleteOrg: (id?: string) => Promise<boolean>;
  refreshOrganizations: () => Promise<Organization[]>;
  refreshActiveOrg: () => Promise<void>;
  refreshTeam: () => Promise<void>;
  inviteTeamMember: (
    email: string,
    role: InvitableOrganizationRole
  ) => Promise<TeamInviteResult>;
  updateTeamMemberRole: (id: string, role: InvitableOrganizationRole) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;
  cancelTeamInvitation: (id: string) => Promise<void>;
  resendTeamInvitation: (
    id: string
  ) => Promise<{ invitation: TeamInvitation; emailSent: boolean; message: string }>;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

const normalizeOrganization = (organization: Organization): Organization => ({
  ...organization,
  logo: organization.logo_url || organization.logo || '',
  language: organization.default_language || organization.language || 'English',
  timezone: organization.timezone || 'GMT+06:00',
});

const errorMessage = (error: any, fallback: string): string => {
  if (typeof error === 'string' && error.trim()) return error;
  if (error?.error) return error.error;
  if (error?.detail) return error.detail;
  if (error?.message) return error.message;
  const firstKey = error && typeof error === 'object' ? Object.keys(error)[0] : null;
  if (firstKey) {
    const value = error[firstKey];
    return `${firstKey}: ${Array.isArray(value) ? value[0] : value}`;
  }
  return fallback;
};

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<OrganizationSubscription | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamInvitations, setTeamInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [isTeamSaving, setIsTeamSaving] = useState(false);
  const [orgError, setOrgError] = useState<string | null>(null);
  const [teamError, setTeamError] = useState<string | null>(null);

  const refreshOrganizations = useCallback(async (): Promise<Organization[]> => {
    if (!userId) {
      setOrganizations([]);
      setActiveOrgId(null);
      return [];
    }

    setIsLoading(true);
    setOrgError(null);
    try {
      const data = await organizationService.listOrganizations();
      const normalized = Array.isArray(data) ? data.map(normalizeOrganization) : [];
      setOrganizations(normalized);
      setActiveOrgId((current) => {
        if (current && normalized.some((organization) => organization.id === current)) {
          return current;
        }
        const saved = localStorage.getItem(`replyai_active_org_id_${userId}`);
        if (saved && normalized.some((organization) => organization.id === saved)) {
          return saved;
        }
        return normalized[0]?.id || null;
      });
      return normalized;
    } catch (error) {
      setOrganizations([]);
      setActiveOrgId(null);
      setOrgError(errorMessage(error, 'Failed to load organizations.'));
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refreshActiveOrg = useCallback(async (): Promise<void> => {
    if (!activeOrgId) {
      setSubscription(null);
      return;
    }

    try {
      const [organizationDetails, subscriptionData] = await Promise.all([
        organizationService.getOrganization(activeOrgId),
        organizationService.getSubscription(activeOrgId),
      ]);
      const normalized = normalizeOrganization(organizationDetails);
      setOrganizations((previous) =>
        previous.map((organization) =>
          organization.id === activeOrgId ? { ...organization, ...normalized } : organization
        )
      );
      setSubscription(subscriptionData);
      setOrgError(null);
    } catch (error) {
      setSubscription(null);
      setOrgError(errorMessage(error, 'Failed to load organization details.'));
      throw error;
    }
  }, [activeOrgId]);

  const refreshTeam = useCallback(async (): Promise<void> => {
    if (!activeOrgId) {
      setTeamMembers([]);
      setTeamInvitations([]);
      return;
    }

    setIsTeamLoading(true);
    setTeamError(null);
    try {
      const [members, invitations] = await Promise.all([
        organizationService.listMembers(activeOrgId),
        organizationService.listInvitations(activeOrgId),
      ]);
      setTeamMembers(members);
      setTeamInvitations(invitations);
    } catch (error) {
      setTeamMembers([]);
      setTeamInvitations([]);
      setTeamError(errorMessage(error, 'Failed to load the organization team.'));
      throw error;
    } finally {
      setIsTeamLoading(false);
    }
  }, [activeOrgId]);

  useEffect(() => {
    setOrganizations([]);
    setActiveOrgId(null);
    setSubscription(null);
    setTeamMembers([]);
    setTeamInvitations([]);
    setOrgError(null);
    if (userId) {
      refreshOrganizations().catch((error) => console.warn('Could not load organizations:', error));
    }
  }, [userId, refreshOrganizations]);

  useEffect(() => {
    if (activeOrgId) {
      refreshActiveOrg().catch((error) => console.warn('Could not load organization details:', error));
      refreshTeam().catch((error) => console.warn('Could not load organization team:', error));
      if (userId) {
        localStorage.setItem(`replyai_active_org_id_${userId}`, activeOrgId);
      }
    } else {
      setSubscription(null);
      setTeamMembers([]);
      setTeamInvitations([]);
    }
  }, [activeOrgId, userId, refreshActiveOrg, refreshTeam]);

  const selectOrg = (id: string) => {
    setActiveOrgId(id);
  };

  const createOrg = async (data: CreateOrganizationPayload | string): Promise<string> => {
    const payload: CreateOrganizationPayload =
      typeof data === 'string'
        ? { name: data, default_language: 'English', timezone: 'GMT+06:00' }
        : data;

    setIsSaving(true);
    setOrgError(null);
    try {
      const response = await organizationService.createOrganization(payload);
      const newOrganization = normalizeOrganization(response);
      setOrganizations((previous) => [...previous, newOrganization]);
      setActiveOrgId(newOrganization.id);
      return newOrganization.id;
    } catch (error) {
      setOrgError(errorMessage(error, 'Failed to create organization.'));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrgSettings = async (
    updates: UpdateOrganizationPayload | Partial<Organization>,
    organizationId?: string
  ): Promise<Organization | undefined> => {
    const targetId = organizationId || activeOrgId;
    if (!targetId) throw new Error('No organization is selected.');

    setIsSaving(true);
    setOrgError(null);
    try {
      const response = await organizationService.updateOrganization(targetId, {
        name: updates.name,
        slug: updates.slug,
        default_language: updates.default_language || updates.language,
        timezone: updates.timezone,
        description: updates.description,
      });
      const updated = normalizeOrganization(response);
      setOrganizations((previous) =>
        previous.map((organization) =>
          organization.id === targetId ? { ...organization, ...updated } : organization
        )
      );
      return updated;
    } catch (error) {
      setOrgError(errorMessage(error, 'Failed to update organization settings.'));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadOrgLogo = async (file: File, organizationId?: string): Promise<string | undefined> => {
    const targetId = organizationId || activeOrgId;
    if (!targetId) throw new Error('No organization is selected.');

    setIsSaving(true);
    try {
      const response = await organizationService.uploadLogo(targetId, file);
      setOrganizations((previous) =>
        previous.map((organization) =>
          organization.id === targetId
            ? { ...organization, logo: response.logo_url, logo_url: response.logo_url }
            : organization
        )
      );
      return response.logo_url;
    } catch (error) {
      setOrgError(errorMessage(error, 'Failed to upload organization logo.'));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const removeOrgLogo = async (organizationId?: string): Promise<void> => {
    const targetId = organizationId || activeOrgId;
    if (!targetId) throw new Error('No organization is selected.');

    setIsSaving(true);
    try {
      await organizationService.removeLogo(targetId);
      setOrganizations((previous) =>
        previous.map((organization) =>
          organization.id === targetId ? { ...organization, logo: '', logo_url: null } : organization
        )
      );
    } catch (error) {
      setOrgError(errorMessage(error, 'Failed to remove organization logo.'));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteOrg = async (id?: string): Promise<boolean> => {
    const targetId = id || activeOrgId;
    if (!targetId) return false;

    setIsSaving(true);
    try {
      await organizationService.deleteOrganization(targetId);
      const remaining = organizations.filter((organization) => organization.id !== targetId);
      setOrganizations(remaining);
      if (targetId === activeOrgId) {
        setActiveOrgId(remaining[0]?.id || null);
      }
      return true;
    } catch (error) {
      setOrgError(errorMessage(error, 'Failed to delete organization.'));
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const inviteTeamMember = async (
    email: string,
    role: InvitableOrganizationRole
  ): Promise<TeamInviteResult> => {
    if (!activeOrgId) throw new Error('No organization is selected.');
    setIsTeamSaving(true);
    setTeamError(null);
    try {
      const result = await organizationService.inviteMember(activeOrgId, email, role);
      await Promise.all([refreshTeam(), refreshActiveOrg()]);
      return result;
    } catch (error) {
      setTeamError(errorMessage(error, 'Failed to invite team member.'));
      throw error;
    } finally {
      setIsTeamSaving(false);
    }
  };

  const updateTeamMemberRole = async (
    id: string,
    role: InvitableOrganizationRole
  ): Promise<void> => {
    if (!activeOrgId) throw new Error('No organization is selected.');
    setIsTeamSaving(true);
    try {
      await organizationService.updateMemberRole(activeOrgId, id, role);
      await Promise.all([refreshTeam(), refreshActiveOrg()]);
    } catch (error) {
      setTeamError(errorMessage(error, 'Failed to update member role.'));
      throw error;
    } finally {
      setIsTeamSaving(false);
    }
  };

  const removeTeamMember = async (id: string): Promise<void> => {
    if (!activeOrgId) throw new Error('No organization is selected.');
    setIsTeamSaving(true);
    try {
      await organizationService.removeMember(activeOrgId, id);
      await Promise.all([refreshTeam(), refreshActiveOrg()]);
    } catch (error) {
      setTeamError(errorMessage(error, 'Failed to remove team member.'));
      throw error;
    } finally {
      setIsTeamSaving(false);
    }
  };

  const cancelTeamInvitation = async (id: string): Promise<void> => {
    if (!activeOrgId) throw new Error('No organization is selected.');
    setIsTeamSaving(true);
    try {
      await organizationService.cancelInvitation(activeOrgId, id);
      await Promise.all([refreshTeam(), refreshActiveOrg()]);
    } catch (error) {
      setTeamError(errorMessage(error, 'Failed to cancel invitation.'));
      throw error;
    } finally {
      setIsTeamSaving(false);
    }
  };

  const resendTeamInvitation = async (id: string) => {
    if (!activeOrgId) throw new Error('No organization is selected.');
    setIsTeamSaving(true);
    try {
      const result = await organizationService.resendInvitation(activeOrgId, id);
      await refreshTeam();
      return result;
    } catch (error) {
      setTeamError(errorMessage(error, 'Failed to resend invitation.'));
      throw error;
    } finally {
      setIsTeamSaving(false);
    }
  };

  const activeOrg = organizations.find((organization) => organization.id === activeOrgId);

  return (
    <OrgContext.Provider
      value={{
        organizations,
        activeOrgId,
        activeOrg,
        subscription,
        teamMembers,
        teamInvitations,
        isLoading,
        isSaving,
        isTeamLoading,
        isTeamSaving,
        orgError,
        teamError,
        createOrg,
        selectOrg,
        updateOrgSettings,
        uploadOrgLogo,
        removeOrgLogo,
        deleteOrg,
        refreshOrganizations,
        refreshActiveOrg,
        refreshTeam,
        inviteTeamMember,
        updateTeamMemberRole,
        removeTeamMember,
        cancelTeamInvitation,
        resendTeamInvitation,
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
