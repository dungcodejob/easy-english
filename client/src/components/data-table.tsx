import {
  CURRENT_PAGE_DEFAULT,
  PAGE_SIZE_DEFAULT,
} from '@/constants/default-values';
import { cn } from '@/utils/cn';
import { recursiveCloneChildren } from '@/utils/recursive-clone-children';
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSearch2Line,
} from '@remixicon/react';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type Row,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React, {
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { InputWithIcon } from './input-with-icon';
import PaginationControls from './pagination-controls';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

const DataTableContext = React.createContext<{
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
}>({ keyword: '', setKeyword: () => {} });

const DATA_TABLE_FILTER_NAME = 'DataTableFilter';

type DataTableFilterProps = React.ComponentProps<'div'> & {
  keyword?: string;
  placeholder: string;
  enableColumnFilters?: boolean;
  onKeywordChange?: (value: string) => void;
} & PropsWithChildren;

export function DataTableFilter({
  keyword: defaultKeyword = '',
  placeholder,
  onKeywordChange,
  enableColumnFilters,
  children,
  className,
  ...rest
}: DataTableFilterProps) {
  const { keyword, setKeyword } = useContext(DataTableContext);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);

    if (enableColumnFilters && onKeywordChange) {
      onKeywordChange(value);
    }
  };

  useEffect(() => {
    setKeyword(defaultKeyword);
  }, [defaultKeyword, setKeyword]);

  return (
    <div className={cn('flex items-center gap-4 mb-4', className)} {...rest}>
      <InputWithIcon
        startIcon={RiSearch2Line}
        className="h-9 "
        defaultValue={keyword}
        placeholder={placeholder}
        onChange={handleSearchChange}
      />
      {children}
    </div>
  );
}

DataTableFilter.displayName = DATA_TABLE_FILTER_NAME;

type DataTableProps<T extends object> = {
  // Columns
  columns: ColumnDef<T>[];
  data: T[];
  getRowId?: (
    originalRow: T,
    index: number,
    parent?: Row<T> | undefined,
  ) => string;

  // Sorting
  enableSorting?: boolean;
  manualSorting?: boolean;
  defaultSorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;

  // Pagination
  totalItems?: number;
  manualPagination?: boolean;
  enablePagination?: boolean;
  defaultPagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;

  // Search
  // enableFiltering?: boolean;
  // globalFilter?: string;
  // onGlobalFilterChange?: (value: string) => void;
  // globalFilterPlaceholder?: string;

  // Other
  isLoading?: boolean;
  isPlaceholderData?: boolean;
  enableRowNumbers?: boolean;
  asChild?: boolean;
} & (
  | {
      enableRowActions: true;
      renderRowActions: (row: Row<T>) => React.ReactNode;
    }
  | {
      enableRowActions?: false;
      renderRowActions?: never;
    }
) &
  PropsWithChildren;

export function DataTable<T extends object>({
  // Columns
  columns,
  data,
  getRowId,
  enableRowNumbers = false,

  // Sorting
  enableSorting = true,
  manualSorting = false,
  defaultSorting = [],
  onSortingChange,

  // Pagination
  enablePagination = true,
  manualPagination = false,
  defaultPagination = {
    pageIndex: CURRENT_PAGE_DEFAULT - 1,
    pageSize: PAGE_SIZE_DEFAULT,
  },
  totalItems,
  onPaginationChange,

  // // Search
  // enableFiltering = false,
  // globalFilter = '',
  // onGlobalFilterChange,
  // globalFilterPlaceholder = 'Search...',

  // Other
  isLoading = false,
  isPlaceholderData = false,

  enableRowActions = false,
  renderRowActions,
  children,
  asChild,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>(defaultSorting);
  const [pagination, setPagination] =
    useState<PaginationState>(defaultPagination);

  const [searchValue, setSearchValue] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const uniqueId = React.useId();

  const extendedChildren = recursiveCloneChildren(
    children as React.ReactElement[],
    null,
    [DATA_TABLE_FILTER_NAME],
    uniqueId,
    asChild,
  );

  const enableFiltering = !!extendedChildren;

  // Handle sorting changes (internal or external)
  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting =
      typeof updater === 'function' ? updater(sorting) : updater;

    setSorting(newSorting);

    if (manualSorting && onSortingChange) {
      onSortingChange(newSorting);
    }
  };

  // Handle pagination changes (internal or external)
  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const newPagination =
      typeof updater === 'function' ? updater(pagination) : updater;

    setPagination(newPagination);

    if (manualPagination && onPaginationChange) {
      onPaginationChange(newPagination);
    }
  };

  const generateColumns = useMemo(() => {
    const generatedColumns: ColumnDef<T>[] = [];

    // Add row number column if enabled
    if (enableRowNumbers) {
      generatedColumns.push({
        id: 'staticRowIndex',
        header: '#',
        enableSorting: false,
        enableColumnFilter: false,
        size: 50,
      });
    }

    // Add user-defined columns
    generatedColumns.push(...columns);

    // Add actions column if enabled
    if (enableRowActions) {
      generatedColumns.push({
        id: 'actions',
        header: () => <div className="text-center">{t('actions')}</div>,
        cell: ({ cell }) => (
          <div className="text-center">{renderRowActions?.(cell.row)}</div>
        ),
        size: 60,
        enableSorting: false,
      });
    }

    return generatedColumns;
  }, [columns, enableRowNumbers, enableRowActions, renderRowActions, t]);

  const table = useReactTable({
    data,
    columns: generateColumns,
    state: {
      sorting,
      columnFilters,
      pagination,
      globalFilter: searchValue,
    },
    onSortingChange: handleSortingChange,
    onPaginationChange: handlePaginationChange,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // Only apply automatic sorting if it's not manual
    getSortedRowModel:
      enableSorting && !manualSorting ? getSortedRowModel() : undefined,
    // Only apply automatic pagination if it's not manual
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    // These flags tell TanStack Table to expect manual control
    manualSorting,
    manualPagination,
    // Use provided page count for server-side pagination
    pageCount: manualPagination
      ? totalItems
        ? Math.ceil(totalItems / pagination.pageSize)
        : undefined
      : undefined,
    enableSorting,
    enableColumnFilters: enableFiltering,
    getRowId,
  });

  const calculatedTotalItems =
    totalItems === undefined ? data.length : totalItems;

  return (
    <DataTableContext.Provider
      value={{
        keyword: searchValue,
        setKeyword: setSearchValue,
      }}
    >
      <div className="w-full">
        {enableFiltering && extendedChildren}

        <div className="w-full">
          <Table className="text-paragraph-sm">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center gap-2 select-none',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <RiArrowUpSLine
                                className="shrink-0 opacity-60 text-text-sub-600 size-5"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <RiArrowDownSLine
                                className="shrink-0 opacity-60 text-text-sub-600 size-5"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length > 0 ? (
                table.getRowModel().rows.map((row, i, arr) => (
                  <React.Fragment key={row.id}>
                    <TableRow data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.column.id === 'staticRowIndex'
                            ? pagination.pageIndex * pagination.pageSize + i + 1
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* {i < arr.length - 1 && <Table.RowDivider />} */}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={generateColumns.length}
                    className="h-24 text-center"
                  >
                    {t('no_results_found')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {enablePagination && (
          <div className="mt-4">
            <PaginationControls
              pageIndex={table.getState().pagination.pageIndex}
              totalItems={calculatedTotalItems}
              onCurrentPageChange={table.setPageIndex}
              pageSize={table.getState().pagination.pageSize}
              onPageSizeChange={(value) => table.setPageSize(value)}
              isPlaceholderData={isPlaceholderData}
            />
          </div>
        )}
      </div>
    </DataTableContext.Provider>
  );
}
