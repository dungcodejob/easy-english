import { QUERY_KEYS } from "@/shared/constants";
import { useErrorHandler } from "@/shared/hooks/use-error-handler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from 'sonner';
import { topicApi } from "../services";
import type { CreateTopicDto } from "../types";
/**
 * Hook to create a new topic
 */
export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (data: CreateTopicDto) => {
      const result = await topicApi.createTopic(data);
      
      if (result.isErr()) {
        throw result.error;
      }

      return result.value.data;
    },
    onSuccess: () => {
      // Invalidate and refetch topics list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
     
    },
    onError: (error) => {
      // Use the global error handler for backend/network errors
      // Validation errors should be handled by the form component via useValidationErrors
      handleError(error as any); 
    },
  })

    return {
      ...mutation,
      mutateAsync: (data: CreateTopicDto) =>
        toast.promise(mutation.mutateAsync(data), {
          loading: t('topic.create.creating'),
          success: t('topic.create.success'),
          error: t('topic.create.error'),
        }),
    };


};