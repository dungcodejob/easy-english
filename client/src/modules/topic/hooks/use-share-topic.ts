import { QUERY_KEYS } from "@/shared/constants";
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

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await topicApi.shareTopic(id);
      const {data} = response.data.result;
      return { id, shareUrl: data.shareUrl };
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('topic.share_success', { defaultValue: 'Topic shared successfully!' }));
    },
    onError: (error) => {
      const errorMessage = error instanceof Error
        ? error.message
        : t('topic.share_error', { defaultValue: 'Failed to share topic' });
      toast.error(errorMessage);
    },
  });
};
