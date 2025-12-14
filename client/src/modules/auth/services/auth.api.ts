import { apiClient } from '@/shared/api/api.client';
import type { AuthResult, LoginCredentials } from '../types';

export const authApi = {
  login: (data: LoginCredentials) =>
    apiClient.post<AuthResult>('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
};
