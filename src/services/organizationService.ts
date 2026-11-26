import { apiRequest } from './apiClient';
import type {
  Organization,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OrganizationSubscription,
  TeamMember,
  TeamInvitation,
  TeamInviteResult,
  InvitableOrganizationRole,
  OrganizationRole,
} from '../types/organization';

interface ApiTeamMember {
  id: string;
  user: string;
  name: string | null;
  email: string;
  role: OrganizationRole;
  last_active: string | null;
  created_at: string;
}

interface ApiTeamInvitation {
  id: string;
  email: string;
  role: InvitableOrganizationRole;
  expires_at: string;
  created_at: string;
}

const mapTeamMember = (member: ApiTeamMember): TeamMember => ({
  id: member.id,
  userId: member.user,
  name: member.name || member.email.split('@')[0],
  email: member.email,
  role: member.role,
  status: 'active',
  lastActive: member.last_active,
  createdAt: member.created_at,
});

const mapTeamInvitation = (invitation: ApiTeamInvitation): TeamInvitation => ({
  id: invitation.id,
  email: invitation.email,
  role: invitation.role,
  status: 'invited',
  expiresAt: invitation.expires_at,
  createdAt: invitation.created_at,
});

export const organizationService = {
  listOrganizations: (): Promise<Organization[]> => {
    return apiRequest('/api/v1/organizations/');
  },

  createOrganization: (payload: CreateOrganizationPayload): Promise<Organization> => {
    return apiRequest('/api/v1/organizations/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getOrganization: (id: string): Promise<Organization> => {
    return apiRequest(`/api/v1/organizations/${id}/`);
  },

  updateOrganization: (
    id: string,
    payload: UpdateOrganizationPayload
  ): Promise<Organization> => {
    return apiRequest(`/api/v1/organizations/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  uploadLogo: (id: string, file: File): Promise<{ success: boolean; logo_url: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    return apiRequest(`/api/v1/organizations/${id}/logo/`, {
      method: 'POST',
      body: formData,
    });
  },

  removeLogo: (id: string): Promise<{ success: boolean; message?: string }> => {
    return apiRequest(`/api/v1/organizations/${id}/logo/`, {
      method: 'DELETE',
    });
  },

  getSubscription: (id: string): Promise<OrganizationSubscription> => {
    return apiRequest(`/api/v1/organizations/${id}/subscription/`);
  },

  deleteOrganization: (id: string): Promise<{ success: boolean; message?: string }> => {
    return apiRequest(`/api/v1/organizations/${id}/`, {
      method: 'DELETE',
    });
  },

  listMembers: async (organizationId: string): Promise<TeamMember[]> => {
    const members: ApiTeamMember[] = await apiRequest(
      `/api/v1/organizations/${organizationId}/members/`
    );
    return members.map(mapTeamMember);
  },

  listInvitations: async (organizationId: string): Promise<TeamInvitation[]> => {
    const invitations: ApiTeamInvitation[] = await apiRequest(
      `/api/v1/organizations/${organizationId}/invitations/`
    );
    return invitations.map(mapTeamInvitation);
  },

  inviteMember: async (
    organizationId: string,
    email: string,
    role: InvitableOrganizationRole
  ): Promise<TeamInviteResult> => {
    const response = await apiRequest(`/api/v1/organizations/${organizationId}/invitations/`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
    return {
      status: response.status,
      member: response.member ? mapTeamMember(response.member) : null,
      invitation: response.invitation ? mapTeamInvitation(response.invitation) : null,
      emailSent: response.email_sent,
      message: response.message,
    };
  },

  updateMemberRole: (
    organizationId: string,
    memberId: string,
    role: InvitableOrganizationRole
  ): Promise<TeamMember> => {
    return apiRequest(`/api/v1/organizations/${organizationId}/members/${memberId}/`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }).then(mapTeamMember);
  },

  removeMember: (organizationId: string, memberId: string): Promise<{ success: boolean }> => {
    return apiRequest(`/api/v1/organizations/${organizationId}/members/${memberId}/`, {
      method: 'DELETE',
    });
  },

  cancelInvitation: (
    organizationId: string,
    invitationId: string
  ): Promise<{ success: boolean }> => {
    return apiRequest(`/api/v1/organizations/${organizationId}/invitations/${invitationId}/`, {
      method: 'DELETE',
    });
  },

  resendInvitation: async (
    organizationId: string,
    invitationId: string
  ): Promise<{ invitation: TeamInvitation; emailSent: boolean; message: string }> => {
    const response = await apiRequest(
      `/api/v1/organizations/${organizationId}/invitations/${invitationId}/resend/`,
      { method: 'POST' }
    );
    return {
      invitation: mapTeamInvitation(response.invitation),
      emailSent: response.email_sent,
      message: response.message,
    };
  },
};
