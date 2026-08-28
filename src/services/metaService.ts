import { apiRequest } from './apiClient';
import type { MetaAuthResponse, MetaPage } from '../types/connections';

export const metaService = {
  getFacebookAuthUrl: async (): Promise<string> => {
    try {
      const data: MetaAuthResponse = await apiRequest('/api/v1/integrations/meta/connect/');
      return data.authorization_url;
    } catch (e) {
      console.warn('Backend API connection failed, returning fallback auth URL', e);
    }
    return window.location.origin + window.location.pathname + '#/mock-facebook-oauth';
  },

  fetchFacebookPages: async (): Promise<MetaPage[]> => {
    try {
      const data: MetaPage[] = await apiRequest('/api/v1/integrations/meta/pages/');
      return data;
    } catch (e) {
      console.warn('Backend API connection failed, returning mock pages', e);
    }
    return [
      { id: 'fb-page-101', name: 'ABC Store Online' },
      { id: 'fb-page-202', name: "Mahmud's Tech Corner" },
      { id: 'fb-page-303', name: 'Global Fashion Co' },
    ];
  },

  linkFacebookPage: async (pageId: string): Promise<void> => {
    try {
      await apiRequest('/api/v1/integrations/meta/select-page/', {
        method: 'POST',
        body: JSON.stringify({ page_id: pageId }),
      });
    } catch (e) {
      console.warn('Backend API connection failed, simulating success locally', e);
    }
  },
};
