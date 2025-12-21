import { apiCall } from '@/shared/api/api-wrapper';
import { apiClient } from '@/shared/api/api.client';
import type { ListResponseDto, SingleResponseDto, SuccessResponseDto } from '@/shared/types/success-response.dto';
import type { CreateWordDto, UpdateWordDto, Word } from '../types';

export const wordApi = {
  getWords: (topicId: string, params?: any) => 
    apiCall(() => apiClient.get<ListResponseDto<Word>>(`/topics/${topicId}/words`, { params })),

  getWordById: (id: string) => 
    apiCall(() => apiClient.get<SingleResponseDto<Word>>(`/words/${id}`)),

  createWord: (topicId: string, data: CreateWordDto) => 
    apiCall(() => apiClient.post<SuccessResponseDto<Word>>(`/topics/${topicId}/words`, data)),

  createFromOxford: (topicId: string, word: string) => 
    apiCall(() => apiClient.post<SuccessResponseDto<Word>>(`/topics/${topicId}/words/oxford`, { word })),

  updateWord: (id: string, data: UpdateWordDto) => 
    apiCall(() => apiClient.patch<SuccessResponseDto<Word>>(`/words/${id}`, data)),

  deleteWord: (id: string) => 
    apiCall(() => apiClient.delete<SuccessResponseDto<void>>(`/words/${id}`)),
};
