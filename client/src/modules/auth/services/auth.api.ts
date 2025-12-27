import { apiCall } from '@/shared/api/api-wrapper';
import { apiClient } from '@/shared/api/api.client';
import type { AppError } from '@/shared/lib/errors/app-error';
import type { SingleResponseDto } from '@/shared/types/success-response.dto';
import type { Result } from 'neverthrow';
import type { AuthResultDto, LoginCredentials } from '../types';

export const authApi = {
  login: (data: LoginCredentials): Promise<Result<{ data: AuthResultDto }, AppError>> => {
    return apiCall(() => apiClient.post<SingleResponseDto<AuthResultDto>>('/auth/login', data));
  },
  logout: (): Promise<Result<void, AppError>> => {
    return apiCall(() => apiClient.post('/auth/logout'));
  },
  refreshToken: (refreshToken: string): Promise<Result<{ data: AuthResultDto }, AppError>> => {
    return apiCall(() => apiClient.post<SingleResponseDto<AuthResultDto>>('/auth/refresh', { refreshToken }));
  },
};
