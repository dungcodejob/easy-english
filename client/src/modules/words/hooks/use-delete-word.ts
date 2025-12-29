import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { wordApi } from '../services/word.api';

export const useDeleteWord = (topicId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await wordApi.deleteWord(id);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] }); // update count
    },
    onError: (error) => {
      handleError(error as any);
    },
  });

  return {
    ...mutation,
    mutateAsync: (id: string) =>
      toast.promise(mutation.mutateAsync(id), {
        loading: t('word.delete.deleting'),
        success: t('word.delete.success'),
        error: t('word.delete.error'),
      }),
  };
};
