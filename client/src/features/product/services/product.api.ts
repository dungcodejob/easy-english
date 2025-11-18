import { apiClient } from '@/api/api.client';
import type { PaginationResult } from '@/types';
import type { ProductQueryParams } from '../types';
import type { Product } from '../types/product';

export const productApi = {
  getProducts: (params?: ProductQueryParams, signal?: AbortSignal) =>
    apiClient.get<PaginationResult<Product>>('/products', { params, signal }),
  getProductById: (id: string) => apiClient.get<Product>(`/products/${id}`),
  updateProduct: (id: string, data: Partial<Product>) =>
    apiClient.put<Product>(`/products/${id}`, data),
  deleteProduct: (id: string) => apiClient.delete(`/products/${id}`),
};
