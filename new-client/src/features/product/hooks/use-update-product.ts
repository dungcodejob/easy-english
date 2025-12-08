import { QUERY_KEYS } from '@/constants/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '../services/product.api';
import type { Product } from '../types/product';

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productApi.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCT] });
    },
  });
}
