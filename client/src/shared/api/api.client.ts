import { useAuthStore } from '@auth/stores';
import axios, { type AxiosError } from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  baseURL: `${import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api/v1'}`,
  timeout: 30000,
});

// Request interceptor - attach auth token
apiClient.interceptors.request.use(
  (config) => {
    const { isAuthenticated, accessToken } = useAuthStore.getState();

    // Skip auth for login/refresh endpoints if needed, but usually handled by public flag or specific check
    // Here we just check if we have a token
    if (isAuthenticated && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Token Refresh Logic
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Check if the request is to an auth endpoint (login, refresh, register)
    // These endpoints should not trigger token refresh
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use getState to access store values and actions
        const { refreshToken } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh endpoint directly to avoid circular dependency or interceptor loops
        const response = await axios.post(
          `${import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api/v1'}/auth/refresh`,
          { refreshToken }
        );

        // Extract tokens from response
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.result;

        // Update store with new tokens (save both if new refresh token is provided)
        useAuthStore.setState({
          accessToken: newAccessToken,
          ...(newRefreshToken && { refreshToken: newRefreshToken }),
        });

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };

