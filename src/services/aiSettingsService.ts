import { apiRequest } from './apiClient';
import type { AISettingsResponse, UpdateAISettingsPayload } from '../types/ai';

export const aiSettingsService = {
  getAISettings: (): Promise<AISettingsResponse> => {
    return apiRequest('/api/v1/ai/settings/');
  },

  updateAISettings: (updates: UpdateAISettingsPayload): Promise<AISettingsResponse> => {
    return apiRequest('/api/v1/ai/settings/', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },
};
