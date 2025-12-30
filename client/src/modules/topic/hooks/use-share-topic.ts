import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
import { toast } from '@/shared/utils/toast';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { topicApi } from "../services";


/**
 * Hook to share a topic (make it public)
 */
export const useShareTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await topicApi.shareTopic(id);
      
      if (result.isErr()) {
        throw result.error;
      }
      
      return { id, shareUrl: result.value.data.shareUrl };
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC, id] });
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
        loading: t('topic.share.sharing'),
        success: t('topic.share.success'),
        error: t('topic.share.error'),
      }),
  };
};
