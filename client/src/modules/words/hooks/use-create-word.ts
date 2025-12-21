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

  return useMutation({
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
      toast.success(t('common.create_success', { resource: t('word.resource') }));
    },
    onError: (error) => {
      handleError(error as any);
    },
  });
};
