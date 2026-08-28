import { apiRequest } from './apiClient';
import type { ProfileResponse } from '../types/auth';

export const profileService = {
  getProfile: (): Promise<ProfileResponse> => {
    return apiRequest('/api/v1/accounts/profile/');
  },

  updateProfile: (updates: Partial<ProfileResponse>): Promise<ProfileResponse> => {
    return apiRequest('/api/v1/accounts/profile/update/', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};
