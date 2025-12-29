import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { wordApi } from '../services/word.api';

export const useCreateWordFromOxford = (topicId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (word: string) => {
      const result = await wordApi.createFromOxford(topicId, word);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
    },
    onError: (error) => {
      handleError(error as any);
    },
  });

  return {
    ...mutation,
    mutateAsync: (word: string) =>
      toast.promise(mutation.mutateAsync(word), {
        loading: t('word.create.creating'),
        success: t('word.create.success'),
        error: t('word.create.error'),
      }),
  };
};
