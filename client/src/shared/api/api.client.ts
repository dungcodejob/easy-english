import { useAuthStore } from '@auth/stores';
import axios from 'axios';

const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  baseURL: `${import.meta.env.PUBLIC_API_URL}`,
});

apiClient.interceptors.request.use(
  async (config) => {
    const { isAuthenticated, tokens } = useAuthStore.getState();

    const controller = new AbortController();
    if (!isAuthenticated || config.url?.includes('/system/v2/login')) {
      return config;
    }

    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
      return config;
    }

    controller.abort();
    return {
      ...config,
      signal: controller.signal,
    };
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { apiClient };
