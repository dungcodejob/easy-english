import { useErrorHandler } from '@/shared/hooks/use-error-handler';
import { toast } from '@/shared/utils/toast';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { dictionaryApi } from '../services/dictionary.api';

interface LookupParams {
  word: string;
  language: string;
}

export function useDictionary() {
  const { handleError } = useErrorHandler();

  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: async ({ word, language }: LookupParams) => {
      const result = await dictionaryApi.lookup({ word, language });
      if (result.isErr()) {
        handleError(result.error);
        throw result.error;
      }
      return result.value.data;
    },
  });

  return {
    ...mutation,
    mutateAsync: (data: LookupParams) =>
      toast.promise(mutation.mutateAsync(data), {
        loading: t('dictionary.lookup.searching'),
        success: t('dictionary.lookup.success'),
        error: t('dictionary.lookup.error'),
      }),
  };
}
