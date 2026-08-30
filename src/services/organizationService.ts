import { apiRequest } from './apiClient';
import type {
  Organization,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  OrganizationSubscription,
} from '../types/organization';

export const organizationService = {
  // 1. GET /api/v1/organizations/ - List all organizations for authenticated user
  listOrganizations: (): Promise<Organization[]> => {
    return apiRequest('/api/v1/organizations/');
  },

  // 2. POST /api/v1/organizations/ - Create a new organization
  createOrganization: (payload: CreateOrganizationPayload): Promise<Organization> => {
    return apiRequest('/api/v1/organizations/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // 3. GET /api/v1/organizations/{id}/ - Retrieve full organization details
  getOrganization: (id: string): Promise<Organization> => {
    return apiRequest(`/api/v1/organizations/${id}/`);
  },

  // 4. PATCH /api/v1/organizations/{id}/ - Update organization details
  updateOrganization: (
    id: string,
    payload: UpdateOrganizationPayload
  ): Promise<Organization> => {
    return apiRequest(`/api/v1/organizations/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  // 5. POST /api/v1/organizations/{id}/logo/ - Upload / change organization logo
  uploadLogo: (id: string, file: File): Promise<{ success: boolean; logo_url: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    return apiRequest(`/api/v1/organizations/${id}/logo/`, {
      method: 'POST',
      body: formData,
    });
  },

  // 6. DELETE /api/v1/organizations/{id}/logo/ - Remove organization logo
  removeLogo: (id: string): Promise<{ success: boolean; message?: string }> => {
    return apiRequest(`/api/v1/organizations/${id}/logo/`, {
      method: 'DELETE',
    });
  },

  // 7. GET /api/v1/organizations/{id}/subscription/ - Get subscription plan & live usage stats
  getSubscription: (id: string): Promise<OrganizationSubscription> => {
    return apiRequest(`/api/v1/organizations/${id}/subscription/`);
  },

  // 8. DELETE /api/v1/organizations/{id}/ - Permanently delete the organization
  deleteOrganization: (id: string): Promise<{ success: boolean; message?: string }> => {
    return apiRequest(`/api/v1/organizations/${id}/`, {
      method: 'DELETE',
    });
  },
};
