import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
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

  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await topicApi.duplicateTopic(id);
      
      if (result.isErr()) {
        throw result.error;
      }
      
      return result.value.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('topic.duplicate_success', { defaultValue: 'Topic duplicated successfully!' }));
    },
    onError: (error) => {
      handleError(error as any);
    },
  });
};