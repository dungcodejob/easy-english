import { apiCall } from '@/shared/api/api-wrapper';
import { apiClient } from '@/shared/api/api.client';
import type { AppError } from '@/shared/lib/errors/app-error';
import type { ListResponseDto, SingleResponseDto } from '@/shared/types/success-response.dto';
import type { Result } from 'neverthrow';
import type { CreateWorkspaceDto, UpdateWorkspaceDto, Workspace } from '../types/workspace.types';

export const workspaceApi = {
  getAll: (): Promise<Result<{ items: Workspace[]; meta: { count: number } }, AppError>> => {
    return apiCall(() => apiClient.get<ListResponseDto<Workspace>>('/workspace'));
  },

  getById: (id: string): Promise<Result<{ data: Workspace }, AppError>> => {
    return apiCall(() => apiClient.get<SingleResponseDto<Workspace>>(`/workspace/${id}`));
  },

  create: (data: CreateWorkspaceDto): Promise<Result<{ data: Workspace }, AppError>> => {
    return apiCall(() => apiClient.post<SingleResponseDto<Workspace>>('/workspace', data));
  },

  update: (id: string, data: UpdateWorkspaceDto): Promise<Result<{ data: Workspace }, AppError>> => {
    return apiCall(() => apiClient.patch<SingleResponseDto<Workspace>>(`/workspace/${id}`, data));
  },

  delete: (id: string): Promise<Result<{ data: null }, AppError>> => {
    return apiCall(() => apiClient.delete<SingleResponseDto<null>>(`/workspace/${id}`));
  },
};
