import Masonry from 'react-masonry-css';

import type { PaginationResult } from '@/types/pagination';
import { useMemo } from 'react';
import { useProducts } from '../hooks/use-products';
import type { Product } from '../types/product';
import { ProductCard } from './product-card';

const breakpointColumnsObj = {
  default: 4,
  1360: 3,
  764: 2,
  500: 1,
};

export function ProductsList() {
  const { data } = useProducts();

  const items = useMemo(
    () => (data as PaginationResult<Product>)?.items || [],
    [data],
  );
  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="-ml-6 flex"
        columnClassName="pl-6 bg-clip-padding flex flex-col gap-6 justify-start"
      >
        {items.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </Masonry>
    </>
  );
}
