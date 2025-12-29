import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
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

  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (input: { id: string; data: UpdateTopicDto }) => {
      const result = await topicApi.updateTopic(input.id, input.data);
      
      if (result.isErr()) {
        throw result.error;
      }
      
      return result.value.data;
    },
    onSuccess: (updatedTopic) => {
      // Update cache for this specific topic
      queryClient.setQueryData(
        [QUERY_KEYS.TOPIC, updatedTopic.id],
        updatedTopic
      );
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
    },
    onError: (error) => {
      handleError(error as any);
    },
  });

  return {
    ...mutation,
    mutateAsync: (input: { id: string; data: UpdateTopicDto }) =>
      toast.promise(mutation.mutateAsync(input), {
        loading: t('topic.update.updating'),
        success: t('topic.update.success'),
        error: t('topic.update.error'),
      }),
  };
};