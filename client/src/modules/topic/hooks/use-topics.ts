import { useWorkspaceStore } from '@/modules/workspace/stores/workspace.store';
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
  const { currentWorkspaceId } = useWorkspaceStore();
  return useQuery({
    queryKey: [QUERY_KEYS.TOPIC, filters],
    queryFn: async () => {
      const result = await topicApi.getTopics({
        ...filters,
        workspaceId: currentWorkspaceId,
      });
      
      if (result.isErr()) {
        throw result.error;
      }

      return result.value.items;
    },
  });
};










