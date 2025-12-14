import { apiClient } from '@/shared/api/api.client';
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
    apiClient.get<ListResponseDto<Topic>>('/topics', { params }),

  /**
   * Get a single topic by ID
   */
  getTopicById: (id: string) => apiClient.get<SingleResponseDto<Topic>>(`/topics/${id}`),

  /**
   * Create a new topic
   */
  createTopic: (data: CreateTopicDto) =>
    apiClient.post<SingleResponseDto<Topic>>('/topics', data),

  /**
   * Update an existing topic
   */
  updateTopic: (id: string, data: UpdateTopicDto) =>
    apiClient.patch<SingleResponseDto<Topic>>(`/topics/${id}`, data),

  /**
   * Delete a topic
   */
  deleteTopic: (id: string) => apiClient.delete(`/topics/${id}`),

  /**
   * Make topic public and get share URL
   */
  shareTopic: (id: string) =>
    apiClient.post<SingleResponseDto<{ shareUrl: string }>>(`/topics/${id}/share`),

  /**
   * Duplicate/clone a topic
   */
  duplicateTopic: (id: string) => apiClient.post<SingleResponseDto<Topic>>(`/topics/${id}/duplicate`),
};
