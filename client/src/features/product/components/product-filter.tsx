'use client';

import * as React from 'react';

import {
  RiArrowDownSLine,
  RiFilter3Line,
  RiLayoutGridLine,
  RiListUnordered,
  RiSearch2Line,
} from '@remixicon/react';

import { InputWithIcon } from '@/components/input-with-icon';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { TypeSafe } from '@/types';

type ProductFilterProps = {
  keyword?: string;
  onKeywordChange: (keyword?: string) => void;
};

export function ProductFilter(props: ProductFilterProps) {
  const [viewType, setViewType] = React.useState<'grid' | 'list'>('grid');
  const [keyword, setKeyword] = React.useState(props.keyword);

  return (
    <div className="flex flex-col gap-3 py-6 md:flex-row">
      <InputWithIcon
        startIcon={RiSearch2Line}
        className="h-9"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          props.onKeywordChange(e.target.value);
        }}
      />

      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <ToggleGroup
          value={viewType}
          type="single"
          onValueChange={(v) => setViewType(v as TypeSafe)}
          className="flex h-9 items-center rounded-10 bg-bg-white-0 px-0.5 ring-1 ring-inset ring-input"
        >
          <ToggleGroupItem
            value="grid"
            id="grid"
            className="flex h-7 items-center px-2 text-text-sub-600 transition duration-200 ease-out data-[state=checked]:text-primary-base"
          >
            <RiLayoutGridLine className="size-5" />
          </ToggleGroupItem>
          <div className="relative h-4 w-0 before:absolute before:inset-y-0 before:left-0 before:w-px before:bg-stroke-soft-200" />
          <ToggleGroupItem
            value="list"
            id="list"
            className="flex h-7 items-center px-2 text-text-sub-600 transition duration-200 ease-out data-[state=checked]:text-primary-base"
          >
            <RiListUnordered className="size-5" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button size="sm" variant="outline" className="rounded-10">
          Last 7 days
          <RiArrowDownSLine />
        </Button>

        <Button size="sm" variant="outline" className="rounded-10">
          Newest
          <RiArrowDownSLine />
        </Button>

        <Button size="sm" variant="outline" className="rounded-10">
          <RiFilter3Line />
          Filter
        </Button>
      </div>
    </div>
  );
}
