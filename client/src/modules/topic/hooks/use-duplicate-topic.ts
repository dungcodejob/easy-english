import { QUERY_KEYS } from "@/shared/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { topicApi } from "../services";

/**
 * Hook to duplicate a topic
 */
export const useDuplicateTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await topicApi.duplicateTopic(id);
      const {data} = response.data.result;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('topic.duplicate_success', { defaultValue: 'Topic duplicated successfully!' }));
    },
    onError: (error) => {
      const errorMessage = error instanceof Error
        ? error.message
        : t('topic.duplicate_error', { defaultValue: 'Failed to duplicate topic' });
      toast.error(errorMessage);
    },
  });
};