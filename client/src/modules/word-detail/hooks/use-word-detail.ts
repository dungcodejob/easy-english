import { useQuery } from '@tanstack/react-query';
import { wordDetailApi } from '../api/word-detail.api';
export const useWordDetail = (keyword: string) => {
  return useQuery({
    queryKey: ['word-detail', keyword],
    queryFn: async () => {
      const result = await wordDetailApi.getWordDetail(keyword);
      if (result.isErr()) {
        throw result.error;
      }
      return result.value;
    },
    enabled: !!keyword,
  });
};
