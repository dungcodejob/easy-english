import { QUERY_KEYS } from "@/shared/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { topicApi } from "../services";

/**
 * Hook to delete a topic
 */
export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (id: string) => {
      await topicApi.deleteTopic(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('topic.delete_success', { defaultValue: 'Topic deleted successfully!' }));
    },
    onError: (error) => {
      const errorMessage = error instanceof Error
        ? error.message
        : t('topic.delete_error', { defaultValue: 'Failed to delete topic' });
      toast.error(errorMessage);
    },
  });
};