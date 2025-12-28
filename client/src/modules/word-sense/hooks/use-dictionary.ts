import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { useMutation } from '@tanstack/react-query';
import { dictionaryApi } from '../services/dictionary.api';

interface LookupParams {
  word: string;
  language: string;
}

export function useDictionary() {
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: async ({ word, language }: LookupParams) => {
      const result = await dictionaryApi.lookup({ word, language });
      if (result.isErr()) {
        handleError(result.error);
        throw result.error;
      }
      return result.value.data;
    },
  });
}
