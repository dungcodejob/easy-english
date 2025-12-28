import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wordSenseApi } from '../services/word-sense.api';
import type { CreateUserWordSenseDto } from '../types/word-sense.types';

export function useCreateWordSense(topicId: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation({
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
      toast.success('Words added successfully');
    },
  });
}
