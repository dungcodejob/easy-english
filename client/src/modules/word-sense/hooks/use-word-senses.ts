import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useQuery } from '@tanstack/react-query';
import { wordSenseApi } from '../services/word-sense.api';

export function useWordSenses(topicId: string) {
  const { handleError } = useErrorHandler();

  return useQuery({
    queryKey: [QUERY_KEYS.WORD_SENSE, topicId],
    queryFn: async () => {
      const result = await wordSenseApi.getByTopic(topicId);
      if (result.isErr()) {
        handleError(result.error);
        return { items: [], meta: { count: 0 } };
      }
      return result.value;
    },
    enabled: !!topicId,
  });
}
