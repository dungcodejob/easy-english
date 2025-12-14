import { useQuery } from '@tanstack/react-query';
import { topicApi } from '../services';
import type {
    TopicFilters
} from '../types';

// Query Keys
export const TOPIC_QUERY_KEYS = {
  ALL: ['topics'] as const,
  LIST: (filters?: TopicFilters) => ['topics', 'list', filters] as const,
  DETAIL: (id: string) => ['topics', 'detail', id] as const,
};

/**
 * Hook to fetch all topics with filters
 */
export const useTopics = (filters?: TopicFilters & { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: TOPIC_QUERY_KEYS.LIST(filters),
    queryFn: async () => {
      const response = await topicApi.getTopics(filters);
      const {items} = response.data.result;
      return items ;
    },
  });
};










