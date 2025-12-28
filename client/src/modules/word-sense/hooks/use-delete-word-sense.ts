import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wordSenseApi } from '../services/word-sense.api';

export function useDeleteWordSense(topicId: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await wordSenseApi.delete(id);
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
      toast.success('Word sense deleted successfully');
    },
  });
}
