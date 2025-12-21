import { QUERY_KEYS } from "@/shared/constants";
import { useQuery } from "@tanstack/react-query";
import { topicApi } from "../services";

/**
 * Hook to fetch a single topic by ID
 */
export const useTopicById = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TOPIC, id],
    queryFn: async () => {
      const result = await topicApi.getTopicById(id);
      
      if (result.isErr()) {
        throw result.error;
      }
      
      return result.value.data;
    },
    enabled: !!id,
  });
};