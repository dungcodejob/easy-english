import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { toast } from '@/shared/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { wordSenseApi } from '../services/word-sense.api';
import type { CreateUserWordSenseDto } from '../types/word-sense.types';

export function useCreateWordSense(topicId: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: async (data: CreateUserWordSenseDto) => {
      const result = await wordSenseApi.createBatch(data);
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
    mutateAsync: (data: CreateUserWordSenseDto) =>
      toast.promise(mutation.mutateAsync(data), {
        loading: t('word_sense.create.creating'),
        success: t('word_sense.create.success'),
        error: t('word_sense.create.error'),
      }),
  };
}
