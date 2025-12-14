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
      const response = await topicApi.getTopicById(id);
      const {data} = response.data.result;
      return data;
    },
    enabled: !!id,
  });
};