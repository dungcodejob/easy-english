import { QUERY_KEYS } from '@/constants/query';
import { queryClient } from '@/providers/query.provider';
import { useMutation } from '@tanstack/react-query';
import { productApi } from '../services/product.api';

export function useDeleteProduct() {
  return useMutation({
    mutationFn: (id: string) => productApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT] });
    },
  });
}
