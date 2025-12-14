import { QUERY_KEYS } from '@/shared/constants/key';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { wordApi } from '../services/word.api';

export const useCreateWordFromOxford = (topicId: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (word: string) => wordApi.createFromOxford(topicId, word),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] });
      toast.success(t('word.oxford_success'));
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || t('word.oxford_error'));
    },
  });
};
