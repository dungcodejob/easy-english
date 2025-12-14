import { QUERY_KEYS } from "@/shared/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from 'sonner';
import { topicApi } from "../services";
import type { UpdateTopicDto } from "../types";
/**
 * Hook to update an existing topic
 */
export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (input: { id: string; data: UpdateTopicDto }) => {
      const response = await topicApi.updateTopic(input.id, input.data);
      const {data} = response.data.result;
      return data;
    },
    onSuccess: (updatedTopic) => {
      // Update cache for this specific topic
      queryClient.setQueryData(
        [QUERY_KEYS.TOPIC, updatedTopic.id],
        updatedTopic
      );
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('topic.update_success', { defaultValue: 'Topic updated successfully!' }));
    },
    onError: (error) => {
      const errorMessage = error instanceof Error
        ? error.message
        : t('topic.update_error', { defaultValue: 'Failed to update topic' });
      toast.error(errorMessage);
    },
  });
};