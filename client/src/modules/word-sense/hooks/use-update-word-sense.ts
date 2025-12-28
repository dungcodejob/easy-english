import { QUERY_KEYS } from '@/shared/constants/key';
import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { wordSenseApi } from '../services/word-sense.api';
import type { UpdateUserWordSenseDto } from '../types/word-sense.types';

export function useUpdateWordSense(topicId: string) {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();

  return useMutation({
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
      toast.success('Word sense updated successfully');
    },
  });
}
