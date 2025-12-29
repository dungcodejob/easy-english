import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { wordSenseApi } from '../services/word-sense.api';

export function useDeleteWordSense(topicId: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await wordSenseApi.delete(id);
      if (result.isErr()) {
        handleError(result.error);
        throw result.error;
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.WORD_SENSE, topicId],
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
    },
  });

  return {
    ...mutation,
    mutateAsync: (id: string) =>
      toast.promise(mutation.mutateAsync(id), {
        loading: t('word_sense.delete.deleting'),
        success: t('word_sense.delete.success'),
        error: t('word_sense.delete.error'),
      }),
  };
}
