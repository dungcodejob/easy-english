import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { wordApi } from '../services/word.api';
import type { CreateWordDto } from '../types';

export const useCreateWord = (topicId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async (data: CreateWordDto) => {
      const result = await wordApi.createWord(topicId, data);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
      // Also invalidate topic to update word count if topic detail is cached
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
    },
    onError: (error) => {
      handleError(error as any);
    },
  });

  return {
    ...mutation,
    mutateAsync: (data: CreateWordDto) =>
      toast.promise(mutation.mutateAsync(data), {
        loading: t('word.create.creating'),
        success: t('word.create.success'),
        error: t('word.create.error'),
      }),
  };
};
