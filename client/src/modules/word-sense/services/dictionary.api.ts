import { apiCall } from '@/shared/api/api-wrapper';
import { apiClient } from '@/shared/api/api.client';
import { API_KEYS } from '@/shared/constants';
import type { SingleResponseDto } from '@/shared/types/success-response.dto';
import type { WordDto } from '../types/word-sense.types';

export const dictionaryApi = {
  /**
   * Lookup word from dictionary
   */
  lookup: (params: { word: string; language: string; source?: string }) =>
    apiCall(() =>
      apiClient.get<SingleResponseDto<WordDto>>(
        `${API_KEYS.DICTIONARY_LOOKUP}/${params.word}`,
      )
    ),
};
