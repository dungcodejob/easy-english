import {
  CURRENT_PAGE_DEFAULT,
  PAGE_SIZE_DEFAULT,
} from '@/constants/default-values';
import type { PaginationState } from '@tanstack/react-table';

export interface PaginationResult<T> {
  items: T[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export type TanstackPagination = PaginationState;
export interface BackendPagination {
  currentPage?: number;
  pageSize?: number;
}

export class Pagination {
  static toTablePagination(
    bePagination: BackendPagination,
  ): TanstackPagination {
    const currentPage = bePagination.currentPage || CURRENT_PAGE_DEFAULT;
    const pageSize = bePagination.pageSize || PAGE_SIZE_DEFAULT;
    return {
      pageIndex: currentPage - 1,
      pageSize: pageSize,
    };
  }
  static toBackendPagination(
    tablePagination: TanstackPagination,
  ): BackendPagination {
    const currentPage = tablePagination.pageIndex + 1;
    const pageSize = tablePagination.pageSize;
    return {
      currentPage,
      pageSize,
    };
  }
}
