import { apiCall } from '@/shared/api/api-wrapper';
import { apiClient } from '@/shared/api/api.client';
import { API_KEYS } from '@/shared/constants';
import type { ListResponseDto, SingleResponseDto } from '@/shared/types/success-response.dto';
import type {
  CreateTopicDto,
  Topic,
  TopicFilters,
  UpdateTopicDto
} from '../types';
export const topicApi = {
  /**
   * Get all topics with optional filters and pagination
   */
  getTopics: (params?: TopicFilters & { page?: number; limit?: number }) =>
    apiCall(() => apiClient.get<ListResponseDto<Topic>>(`${API_KEYS.TOPIC}`, { params })),

  /**
   * Get a single topic by ID
   */
  getTopicById: (id: string) => 
    apiCall(() => apiClient.get<SingleResponseDto<Topic>>(`${API_KEYS.TOPIC}/${id}`)),

  /**
   * Create a new topic
   */
  createTopic: (data: CreateTopicDto) =>
    apiCall(() => apiClient.post<SingleResponseDto<Topic>>(`${API_KEYS.TOPIC}`, data)),

  /**
   * Update an existing topic
   */
  updateTopic: (id: string, data: UpdateTopicDto) =>
    apiCall(() => apiClient.put<SingleResponseDto<Topic>>(`${API_KEYS.TOPIC}/${id}`, data)),

  /**
   * Delete a topic
   */
  deleteTopic: (id: string) => 
    apiCall(() => apiClient.delete(`${API_KEYS.TOPIC}/${id}`)),

  /**
   * Make topic public and get share URL
   */
  shareTopic: (id: string) =>
    apiCall(() => apiClient.post<SingleResponseDto<{ shareUrl: string }>>(`${API_KEYS.TOPIC}/${id}/share`)),

  /**
   * Duplicate/clone a topic
   */
  duplicateTopic: (id: string) => 
    apiCall(() => apiClient.post<SingleResponseDto<Topic>>(`${API_KEYS.TOPIC}/${id}/duplicate`)),
};
