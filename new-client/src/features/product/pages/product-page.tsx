import { useFilters } from '@/hooks/use-filters';
import { createFileRoute } from '@tanstack/react-router';
import { ProductFilter } from '../components/product-filter';
import { ProductsList } from '../components/product-list';
import { ProductTable } from '../components/product-table';
import type { ProductQueryParams } from '../types';

export const Route = createFileRoute('/_(authenticated)/products')({
  component: ProductPage,
  validateSearch: () => ({}) as Partial<ProductQueryParams>,
});

export default function ProductPage() {
  const { filters, setFilters } = useFilters(Route.id);
  return (
    <div className="flex flex-col items-center justify-center mt-6 md:mt-10">
      <div className="px-4 pb-6 lg:px-8 w-full">
        {/* <DashedDivider />
        <ProductsSummary />
        <DashedDivider /> */}

        <ProductFilter
          keyword={filters.keyword}
          onKeywordChange={(keyword) => setFilters({ keyword })}
        />
        {/* <ProductsList /> */}
        <ProductTable />
        {/* <EditProductDrawer /> */}
      </div>
    </div>
  );
}
