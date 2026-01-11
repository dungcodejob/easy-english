import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from "sonner";
import { wordApi } from '../services/word.api';
import type { UpdateWordDto } from '../types';

export const useUpdateWord = (topicId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { handleError } = useErrorHandler();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateWordDto }) => {
      const result = await wordApi.updateWord(id, data);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
    },
    onError: (error) => {
      handleError(error as any);
    },
  });

  return {
    ...mutation,
    mutateAsync: (variables: { id: string; data: UpdateWordDto }) =>
      toast.promise(mutation.mutateAsync(variables), {
        loading: t('word.update.updating'),
        success: t('word.update.success'),
        error: t('word.update.error'),
      }),
  };
};
