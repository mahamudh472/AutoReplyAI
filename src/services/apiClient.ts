import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './tokenService';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

  // Set default headers
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
          body: JSON.stringify({ refresh: getRefreshToken() }),
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
