import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  CURRENT_PAGE_DEFAULT,
  PAGE_SIZE_DEFAULT,
  PAGE_SIZE_OPTIONS,
} from '@/constants/default-values';
import { cn } from '@/utils/cn';
// import { getPageNumbers } from '@/utils/helpers';
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from '@remixicon/react';
import { type FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, buttonVariants } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export const getPageNumbers = (
  totalPages: number,
  currentPage: number,
): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the start
      pages.push(2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push(
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      // Middle
      pages.push(
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
      );
    }
  }

  return pages;
};

type PaginationTextProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'button'>;

function PaginationText({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationTextProps) {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

export type PaginationProps = {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onCurrentPageChange: (page: number) => void;
  onPageSizeChange: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  isPlaceholderData?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const PaginationControls: FC<PaginationProps> = ({
  pageIndex = CURRENT_PAGE_DEFAULT - 1,
  pageSize = PAGE_SIZE_DEFAULT,
  totalItems,
  onCurrentPageChange: onPageChange,
  onPageSizeChange,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
  isPlaceholderData = false,
  className,
  ...rest
}: PaginationProps) => {
  const { t } = useTranslation();

  const totalPages = useMemo(
    () => Math.ceil(totalItems / (pageSize || 0)),
    [totalItems, pageSize],
  );
  const goToFirstPage = () => onPageChange(0);
  const goToPreviousPage = () => onPageChange(Math.max(0, pageIndex - 1));
  const goToNextPage = () =>
    onPageChange(Math.min(totalPages - 1, pageIndex + 1));
  const goToLastPage = () => onPageChange(totalPages - 1);

  const pageNumbers = useMemo(
    () => getPageNumbers(totalPages, pageIndex + 1),
    [totalPages, pageIndex],
  );

  const start = pageIndex * pageSize + 1;
  const end = Math.min(start + pageSize - 1, totalItems);

  const handleClickPageNumber: (page: number | string) => void = (page) => {
    if (typeof page === 'number') {
      onPageChange(page - 1);
    }
  };

  // return <div  className={cn('flex items-center justify-between px-4 w-full', className)} {...rest}>
  //   <div className="hidden flex-1 text-sm text-muted-foreground lg:flex">
  //     {table.getFilteredSelectedRowModel().rows.length} of{" "}
  //     {table.getFilteredRowModel().rows.length} row(s) selected.
  //   </div>
  //   <div className="flex  items-center gap-8">
  //     <div className="hidden items-center gap-2 lg:flex">
  //       <Label htmlFor="rows-per-page" className="text-sm font-medium">
  //         Rows per page
  //       </Label>
  //       <Select
  //         value={`${pageSize}`}
  //         onValueChange={(value) => onPageSizeChange(Number(value))}
  //       >
  //         <SelectTrigger className="w-20" id="rows-per-page">
  //           <SelectValue
  //             placeholder={pageSize}
  //           />
  //         </SelectTrigger>
  //         <SelectContent side="top">
  //           {pageSizeOptions.map((pageSize) => (
  //             <SelectItem key={pageSize} value={`${pageSize}`}>
  //               {pageSize}
  //             </SelectItem>
  //           ))}
  //         </SelectContent>
  //       </Select>
  //     </div>
  //     <div className="flex w-fit items-center justify-center text-sm font-medium">
  //       Page {pageIndex + 1} of{" "}
  //       {totalItems/ pageSize}
  //     </div>
  //     <div className="ml-auto flex items-center gap-2 lg:ml-0">
  //       <Button
  //         variant="outline"
  //         className="hidden h-8 w-8 p-0 lg:flex"
  //         onClick={() => goToFirstPage()}
  //         disabled={pageIndex === 0}
  //       >
  //         <span className="sr-only">Go to first page</span>
  //         <ChevronsLeftIcon />
  //       </Button>
  //       <Button
  //         variant="outline"
  //         className="size-8"
  //         size="icon"
  //         onClick={() => goToPreviousPage()}
  //         disabled={pageIndex === 0}
  //       >
  //         <span className="sr-only">Go to previous page</span>
  //         <ChevronLeftIcon />
  //       </Button>
  //       <Button
  //         variant="outline"
  //         className="size-8"
  //         size="icon"
  //         onClick={() => goToNextPage()}
  //         disabled={pageIndex === totalPages}
  //       >
  //         <span className="sr-only">Go to next page</span>
  //         <ChevronRightIcon />
  //       </Button>
  //       <Button
  //         variant="outline"
  //         className="hidden size-8 lg:flex"
  //         size="icon"
  //         onClick={() => goToLastPage()}
  //         disabled={pageIndex === totalPages}
  //       >
  //         <span className="sr-only">Go to last page</span>
  //         <ChevronsRightIcon />
  //       </Button>
  //     </div>
  //   </div>
  // </div>

  return (
    <div className={cn('mt-auto', className)} {...rest}>
      <div className="mt-4 flex items-center justify-between py-4 lg:hidden">
        <Button variant="outline" size="sm" className="w-28">
          {t('pagination.previous')}
        </Button>
        <span className="whitespace-nowrap text-center text-paragraph-sm text-text-sub-600">
          {t('pagination.page_of', {
            currentPage: pageIndex + 1,
            totalPages,
          })}
        </span>
        <Button variant="outline" size="sm" className="w-28">
          {t('pagination.next')}
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between py-4 lg:hidden">
        <PaginationItem>
          <PaginationPrevious
            size="sm"
            className="w-28"
            onClick={goToPreviousPage}
            aria-disabled={pageIndex === 0}
          >
            {t('pagination.previous')}
          </PaginationPrevious>
        </PaginationItem>
        <span className="whitespace-nowrap text-center text-paragraph-sm text-text-sub-600">
          {t('pagination.page_of', {
            currentPage: pageIndex + 1,
            totalPages,
          })}
        </span>
        <PaginationNext
          size="sm"
          className="w-28"
          onClick={goToNextPage}
          aria-disabled={pageIndex + 1 === totalPages}
        >
          {t('pagination.next')}
        </PaginationNext>
      </div>
      <div className="mt-10 hidden items-center gap-3 lg:flex">
        <span className="flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600">
          {t('pagination.display_items', { start, end, totalItems })}
        </span>

        <Pagination>
          <PaginationContent>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => goToFirstPage()}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <RiArrowLeftDoubleLine />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => goToPreviousPage()}
              disabled={pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <RiArrowLeftSLine />
            </Button>

            {pageNumbers.map((page) =>
              typeof page === 'number' ? (
                <PaginationItem
                  key={`page-${page}`}
                  onClick={() => handleClickPageNumber(page)}
                >
                  {/* <PaginationText>{page}</PaginationText> */}
                  <PaginationLink isActive={page - 1 === pageIndex}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={`ellipsis-${page}`}>{page}</PaginationItem>
              ),
            )}

            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => goToNextPage()}
              disabled={pageIndex === totalPages - 1 || isPlaceholderData}
            >
              <span className="sr-only">Go to next page</span>
              <RiArrowRightSLine />
            </Button>

            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => goToLastPage()}
              disabled={pageIndex === totalPages - 1 || isPlaceholderData}
            >
              <span className="sr-only">Go to last page</span>
              <RiArrowRightDoubleLine />
            </Button>
          </PaginationContent>
        </Pagination>

        <div className="flex flex-1 justify-end">
          <Select
            defaultValue={pageSize?.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  <span className="lowercase">
                    {option} / {t('pagination.page')}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
