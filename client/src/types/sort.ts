import type { SortingState as TanstackSortingState } from '@tanstack/react-table';

export type TanstackSort = TanstackSortingState;

export interface BackendSort {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export class Sort {
  static toTableSort(beSort: BackendSort): TanstackSort {
    if (beSort.sortBy && beSort.sortDirection) {
      return [{ id: beSort.sortBy, desc: beSort.sortDirection === 'desc' }];
    }
    return [];
  }

  static toBackendSort(uiSort: TanstackSort): BackendSort {
    if (uiSort && uiSort.length > 0) {
      const value = uiSort[0];
      return {
        sortBy: value.id,
        sortDirection: value.desc ? 'desc' : 'asc',
      };
    }
    return {};
  }
}
