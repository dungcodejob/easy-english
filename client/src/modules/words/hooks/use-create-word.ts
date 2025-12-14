import { QUERY_KEYS } from '@/shared/constants/key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { wordApi } from '../services/word.api';
import type { CreateWordDto } from '../types';

export const useCreateWord = (topicId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: CreateWordDto) => wordApi.createWord(topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
      // Also invalidate topic to update word count if topic detail is cached
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('common.create_success', { resource: t('word.resource') }));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('common.create_error'));
    },
  });
};
