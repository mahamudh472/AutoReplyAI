const ACCESS_TOKEN_KEY = 'replyai_access_token';
const REFRESH_TOKEN_KEY = 'replyai_refresh_token';

export const tokenService = {
  getAccessToken: (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setTokens: (access: string, refresh?: string): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    if (refresh) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    }
  },
  clearTokens: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Aliases for direct imports & backward compatibility
export const getAccessToken = tokenService.getAccessToken;
export const getRefreshToken = tokenService.getRefreshToken;
export const setTokens = tokenService.setTokens;
export const clearTokens = tokenService.clearTokens;
