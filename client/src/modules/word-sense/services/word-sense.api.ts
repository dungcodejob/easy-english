import { apiCall } from '@/shared/api/api-wrapper';
import { apiClient } from '@/shared/api/api.client';
import { API_KEYS } from '@/shared/constants';
import type {
    ListResponseDto,
    SingleResponseDto,
} from '@/shared/types/success-response.dto';
import type {
    CreateUserWordSenseDto,
    UpdateUserWordSenseDto,
    UserWordSense,
} from '../types/word-sense.types';

export const wordSenseApi = {
  /**
   * Get all word senses for a topic
   */
  getByTopic: (topicId: string) =>
    apiCall(() =>
      apiClient.get<ListResponseDto<UserWordSense>>(
        `${API_KEYS.TOPIC}/${topicId}/word-senses`
      )
    ),

  /**
   * Batch create word senses
   */
  createBatch: (data: CreateUserWordSenseDto) =>
    apiCall(() =>
      apiClient.post<ListResponseDto<UserWordSense>>(
        API_KEYS.USER_WORD_SENSE,
        data
      )
    ),

  /**
   * Update a word sense
   */
  update: (id: string, data: UpdateUserWordSenseDto) =>
    apiCall(() =>
      apiClient.put<SingleResponseDto<UserWordSense>>(
        `${API_KEYS.USER_WORD_SENSE}/${id}`,
        data
      )
    ),

  /**
   * Delete a word sense
   */
  delete: (id: string) =>
    apiCall(() => apiClient.delete(`${API_KEYS.USER_WORD_SENSE}/${id}`)),
};
