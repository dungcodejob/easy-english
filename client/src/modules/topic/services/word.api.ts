import { apiClient } from '@/shared/api/api.client';
import type { ListResponseDto, SingleResponseDto, SuccessResponseDto } from '@/shared/types/success-response.dto';
import type { CreateWordDto, UpdateWordDto, Word } from '../types';

export const wordApi = {
  getWords: async (topicId: string, params?: any) => {
    const response = await apiClient.get<ListResponseDto<Word>>(`/topics/${topicId}/words`, { params });
    return response.data;
  },

  getWordById: async (id: string) => {
    const response = await apiClient.get<SingleResponseDto<Word>>(`/words/${id}`);
    return response.data;
  },

  createWord: async (topicId: string, data: CreateWordDto) => {
    const response = await apiClient.post<SuccessResponseDto<Word>>(`/topics/${topicId}/words`, data);
    return response.data;
  },

  createFromOxford: async (topicId: string, word: string) => {
    const response = await apiClient.post<SuccessResponseDto<Word>>(`/topics/${topicId}/words/oxford`, { word });
    return response.data;
  },

  updateWord: async (id: string, data: UpdateWordDto) => {
    const response = await apiClient.patch<SuccessResponseDto<Word>>(`/words/${id}`, data);
    return response.data;
  },

  deleteWord: async (id: string) => {
    const response = await apiClient.delete<SuccessResponseDto<void>>(`/words/${id}`);
    return response.data;
  },
};
