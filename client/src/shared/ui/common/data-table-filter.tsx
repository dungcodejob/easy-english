import { cn } from "@/shared/utils";
import { RiSearch2Line } from "@remixicon/react";
import { useContext, useEffect, type PropsWithChildren } from "react";
import { DataTableContext } from "./data-table";
import { InputWithIcon } from "./input-with-icon";

export const DATA_TABLE_FILTER_NAME = 'DataTableFilter';


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