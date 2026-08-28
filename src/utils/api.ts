const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface ProfileResponse {
  id: string;
  is_superuser: boolean;
  email: string;
  username: string | null;
  full_name: string;
  phone_number: string | null;
  avatar: string | null;
  gender: string | null;
  age: number | null;
  date_of_birth: string | null;
  joined_at: string;
  last_login: string | null;
  is_active: boolean;
  is_staff: boolean;
  groups: any[];
  user_permissions: any[];
}

export interface AISettingsResponse {
  id: string;
  organization_id: string;
  organization_name: string;
  is_enabled: boolean;
  provider: 'openai' | 'gemini' | 'anthropic' | string;
  model_name: string;
  api_key: string | null;
  system_prompt: string;
  tone: 'professional' | 'friendly' | 'casual' | 'formal' | string;
  temperature: number;
  max_tokens: number;
  fallback_message: string;
  auto_reply_delay_seconds: number;
  business_name: string | null;
  business_description: string | null;
  created_at: string;
  updated_at: string;
}

export type UpdateAISettingsPayload = Partial<
  Omit<AISettingsResponse, 'id' | 'organization_id' | 'organization_name' | 'created_at' | 'updated_at'>
>;

export interface KnowledgeDocument {
  id: string;
  organization_id: string;
  organization_name: string;
  title: string;
  description: string | null;
  file: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  source_type: 'file' | 'text' | 'faq' | 'url' | string;
  raw_content: string | null;
  status: 'pending' | 'processing' | 'indexed' | 'failed' | string;
  error_message: string | null;
  character_count: number;
  word_count: number;
  chunk_count: number;
  tags: string[];
  metadata: Record<string, any>;
  is_active: boolean;
  created_by_email: string | null;
  created_at: string;
  updated_at: string;
  indexed_at: string | null;
}

export interface KnowledgeBaseFilterParams {
  status?: 'pending' | 'processing' | 'indexed' | 'failed' | string;
  source_type?: 'file' | 'text' | 'faq' | 'url' | string;
  is_active?: boolean | string;
  tag?: string;
  search?: string;
}

export interface CreateKnowledgeDocumentPayload {
  file?: File | null;
  title?: string;
  description?: string;
  raw_content?: string;
  source_type?: 'file' | 'text' | 'faq' | 'url' | string;
  tags?: string[] | string;
  metadata?: Record<string, any> | string;
  is_active?: boolean;
}

export interface UpdateKnowledgeDocumentPayload {
  title?: string;
  description?: string;
  raw_content?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  is_active?: boolean;
}

// Token storage helpers
export const getAccessToken = () => localStorage.getItem('replyai_access_token');
export const getRefreshToken = () => localStorage.getItem('replyai_refresh_token');
export const setTokens = (access: string, refresh?: string) => {
  localStorage.setItem('replyai_access_token', access);
  if (refresh) {
    localStorage.setItem('replyai_refresh_token', refresh);
  }
};
export const clearTokens = () => {
  localStorage.removeItem('replyai_access_token');
  localStorage.removeItem('replyai_refresh_token');
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  // Set headers
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  const token = getAccessToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  const response = await fetch(url, { ...options, headers });
  
  // Handle 401 Unauthorized (Token might be expired)
  if (
    response.status === 401 && 
    getRefreshToken() && 
    !endpoint.includes('/accounts/token/refresh/') &&
    !endpoint.includes('/accounts/login/')
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${BASE_URL}/api/v1/accounts/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: getRefreshToken() })
        });
        
        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          setTokens(data.access);
          isRefreshing = false;
          onRefreshed(data.access);
        } else {
          isRefreshing = false;
          clearTokens();
          localStorage.removeItem('replyai_user');
          window.location.hash = '#/auth';
          throw new Error('Session expired');
        }
      } catch (err) {
        isRefreshing = false;
        clearTokens();
        localStorage.removeItem('replyai_user');
        window.location.hash = '#/auth';
        throw err;
      }
    }
    
    // Wait for refresh to complete and retry original request
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((newToken) => {
        headers.set('Authorization', `Bearer ${newToken}`);
        fetch(url, { ...options, headers })
          .then((res) => {
            if (!res.ok) {
              return res.json().then(reject);
            }
            if (res.status === 204 || res.status === 205) {
              return { success: true };
            }
            return res.json();
          })
          .then(resolve)
          .catch(reject);
      });
    });
  }
  
  if (response.status === 204 || response.status === 205) {
    return { success: true };
  }

  const responseData = await response.json();
  if (!response.ok) {
    throw responseData;
  }
  return responseData;
};

// API Service Wrappers
export const api = {
  register: (email: string, password: string, fullName: string) => {
    return apiRequest('/api/v1/accounts/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName })
    });
  },

  verifyEmail: (email: string, otp: string) => {
    return apiRequest('/api/v1/accounts/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  },

  login: (email: string, password: string): Promise<TokenResponse> => {
    return apiRequest('/api/v1/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  logout: (refreshToken: string) => {
    return apiRequest('/api/v1/accounts/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    });
  },

  passwordReset: (email: string) => {
    return apiRequest('/api/v1/accounts/password-reset/', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  checkOtp: (email: string, otp: string) => {
    return apiRequest('/api/v1/accounts/check-otp/', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  },

  passwordResetConfirm: (email: string, otp: string, newPassword: string) => {
    return apiRequest('/api/v1/accounts/password-reset-confirm/', {
      method: 'POST',
      body: JSON.stringify({ email, otp, new_password: newPassword })
    });
  },

  changePassword: (oldPassword: string, newPassword: string, confirmPassword: string) => {
    return apiRequest('/api/v1/accounts/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
    });
  },

  getProfile: (): Promise<ProfileResponse> => {
    return apiRequest('/api/v1/accounts/profile/');
  },

  updateProfile: (updates: Partial<ProfileResponse>): Promise<ProfileResponse> => {
    return apiRequest('/api/v1/accounts/profile/update/', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  getAISettings: (): Promise<AISettingsResponse> => {
    return apiRequest('/api/v1/ai/settings/');
  },

  updateAISettings: (updates: UpdateAISettingsPayload): Promise<AISettingsResponse> => {
    return apiRequest('/api/v1/ai/settings/', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  getKnowledgeBase: (params?: KnowledgeBaseFilterParams): Promise<KnowledgeDocument[]> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.source_type && params.source_type !== 'all') query.append('source_type', params.source_type);
    if (params?.is_active !== undefined && params.is_active !== 'all' && params.is_active !== '') {
      query.append('is_active', String(params.is_active));
    }
    if (params?.tag) query.append('tag', params.tag);
    if (params?.search) query.append('search', params.search);

    const qs = query.toString();
    return apiRequest(`/api/v1/ai/knowledge-base/${qs ? `?${qs}` : ''}`);
  },

  getKnowledgeDocument: (id: string): Promise<KnowledgeDocument> => {
    return apiRequest(`/api/v1/ai/knowledge-base/${id}/`);
  },

  uploadKnowledgeDocument: (payload: CreateKnowledgeDocumentPayload | FormData): Promise<KnowledgeDocument> => {
    if (payload instanceof FormData) {
      return apiRequest('/api/v1/ai/knowledge-base/upload/', {
        method: 'POST',
        body: payload
      });
    }

    if (payload.file) {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.title) formData.append('title', payload.title);
      if (payload.description) formData.append('description', payload.description);
      if (payload.raw_content) formData.append('raw_content', payload.raw_content);
      if (payload.source_type) formData.append('source_type', payload.source_type);
      if (payload.tags) {
        formData.append('tags', Array.isArray(payload.tags) ? JSON.stringify(payload.tags) : payload.tags);
      }
      if (payload.metadata) {
        formData.append('metadata', typeof payload.metadata === 'object' ? JSON.stringify(payload.metadata) : payload.metadata);
      }
      if (payload.is_active !== undefined) formData.append('is_active', String(payload.is_active));

      return apiRequest('/api/v1/ai/knowledge-base/upload/', {
        method: 'POST',
        body: formData
      });
    }

    return apiRequest('/api/v1/ai/knowledge-base/upload/', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  updateKnowledgeDocument: (id: string, updates: UpdateKnowledgeDocumentPayload): Promise<KnowledgeDocument> => {
    return apiRequest(`/api/v1/ai/knowledge-base/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  },

  deleteKnowledgeDocument: (id: string): Promise<any> => {
    return apiRequest(`/api/v1/ai/knowledge-base/${id}/`, {
      method: 'DELETE'
    });
  }
};
