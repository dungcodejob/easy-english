import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
import { toast } from '@/shared/utils/toast';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { topicApi } from "../services";

/**
 * Hook to duplicate a topic
 */
export const useDuplicateTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await topicApi.duplicateTopic(id);
      
      if (result.isErr()) {
        throw result.error;
      }
      
      return result.value.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
    },
    onError: (error) => {
      handleError(error as any);
    },
  });

  return {
    ...mutation,
    mutateAsync: (id: string) =>
      toast.promise(mutation.mutateAsync(id), {
        loading: t('topic.duplicate.duplicating'),
        success: t('topic.duplicate.success'),
        error: t('topic.duplicate.error'),
      }),
  };
};