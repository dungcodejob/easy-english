import { QUERY_KEYS } from "@/shared/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from 'sonner';
import { topicApi } from "../services";
import type { CreateTopicDto } from "../types";
/**
 * Hook to create a new topic
 */
export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data: CreateTopicDto) => {
      const response = await topicApi.createTopic(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('topic.create_success', { defaultValue: 'Topic created successfully!' }));
    },
    onError: (error) => {
      const errorMessage = error instanceof Error
        ? error.message
        : t('topic.create_error', { defaultValue: 'Failed to create topic' });
      toast.error(errorMessage);
    },
  });
};