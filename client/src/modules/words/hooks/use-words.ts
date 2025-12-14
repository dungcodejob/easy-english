import { QUERY_KEYS } from '@/shared/constants/key';
import { useQuery } from '@tanstack/react-query';
import { wordApi } from '../services/word.api';

export const useWords = (topicId: string, params?: any) => {
  return useQuery({
    queryKey: [QUERY_KEYS.WORD, topicId, params],
    queryFn: async () => {
      const res = await wordApi.getWords(topicId, params);

      return res.result;
    },
    enabled: !!topicId,
  });
};
