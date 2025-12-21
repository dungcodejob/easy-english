import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { topicApi } from "../services";


/**
 * Hook to share a topic (make it public)
 */
export const useShareTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { handleError } = useErrorHandler();

  return useMutation({
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
      toast.success(t('topic.share_success', { defaultValue: 'Topic shared successfully!' }));
    },
    onError: (error) => {
      handleError(error as any);
    },
  });
};
