import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { toast } from '@/shared/utils/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { wordSenseApi } from '../services/word-sense.api';
import type { UpdateUserWordSenseDto } from '../types/word-sense.types';

export function useUpdateWordSense(topicId: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserWordSenseDto;
    }) => {
      const result = await wordSenseApi.update(id, data);
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
    },
  });

  return {
    ...mutation,
    mutateAsync: (variables: { id: string; data: UpdateUserWordSenseDto }) =>
      toast.promise(mutation.mutateAsync(variables), {
        loading: t('word_sense.update.updating'),
        success: t('word_sense.update.success'),
        error: t('word_sense.update.error'),
      }),
  };
}
