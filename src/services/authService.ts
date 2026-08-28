import { apiRequest } from './apiClient';
import type { TokenResponse } from '../types/auth';

export const authService = {
  register: (email: string, password: string, fullName: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/register/', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  },

  verifyEmail: (email: string, otp: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/verify-email/', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  login: (email: string, password: string): Promise<TokenResponse> => {
    return apiRequest('/api/v1/accounts/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: (refreshToken: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  },

  passwordReset: (email: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/password-reset/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  passwordResetRequest: (email: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/password-reset/', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  checkOtp: (email: string, otp: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/check-otp/', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  passwordResetConfirm: (email: string, otp: string, newPassword: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/password-reset-confirm/', {
      method: 'POST',
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });
  },

  changePassword: (oldPassword: string, newPassword: string, confirmPassword: string): Promise<any> => {
    return apiRequest('/api/v1/accounts/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    });
  },
};
