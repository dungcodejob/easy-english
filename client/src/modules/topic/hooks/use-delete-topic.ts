import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
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

  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await topicApi.deleteTopic(id);
      
      if (result.isErr()) {
        throw result.error;
      }
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('topic.delete_success', { defaultValue: 'Topic deleted successfully!' }));
    },
    onError: (error) => {
      handleError(error as any);
    },
  });
};