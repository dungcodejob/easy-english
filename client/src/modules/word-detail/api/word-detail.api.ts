import { apiCall } from '@/shared/api/api-wrapper';
import { apiClient } from '@/shared/api/api.client';
import type { AppError } from '@/shared/lib/errors/app-error';
import { Result } from 'neverthrow';
import type { WordDetailResponseDto } from '../types/word-detail.types';

export const wordDetailApi = {
  getWordDetail: async (keyword: string): Promise<Result<WordDetailResponseDto, AppError>> => {
    return apiCall<WordDetailResponseDto>(() => 
      apiClient.get(`/word-detail/${keyword}`)
    );
  },
};
