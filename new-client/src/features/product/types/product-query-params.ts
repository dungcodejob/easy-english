import type { BackendPagination } from '@/types';
import type { BackendSort } from '@/types';

export type ProductQueryParams = BackendPagination &
  BackendSort & {
    keyword?: string;
  };
