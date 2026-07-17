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
  }
};
