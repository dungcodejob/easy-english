import { QUERY_KEYS } from '@/shared/constants';
import { useQuery } from '@tanstack/react-query';
import { topicApi } from '../services';
import type {
    TopicFilters
} from '../types';



/**
 * Hook to fetch all topics with filters
 */
export const useTopics = (filters?: TopicFilters & { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOPIC, filters],
    queryFn: async () => {
      const response = await topicApi.getTopics(filters);
      const {items} = response.data.result;
      return items ;
    },
  });
};










