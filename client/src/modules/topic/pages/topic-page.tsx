import { Button } from '@/shared/ui/shadcn/button';
import { Input } from '@/shared/ui/shadcn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/shadcn/select';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import { RiAddLine, RiBookOpenLine, RiSearchLine } from '@remixicon/react';
import { createFileRoute } from '@tanstack/react-router';
import * as React from 'react';
import { TopicCard, TopicDialog } from '../components';
import { useTopics } from '../hooks';
import { TopicCategory, type TopicFilters } from '../types';

export const Route = createFileRoute('/_(authenticated)/topic')({
  component: TopicPage,
});

export function TopicPage() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<TopicFilters>({
    category: undefined,
    search: '',
  });
  const [searchInput, setSearchInput] = React.useState('');

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data = [], isLoading, error } = useTopics(filters);

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Topics</h1>
          <p className="text-muted-foreground">
            Organize your vocabulary into topics
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="lg">
          <RiAddLine className="mr-2 h-5 w-5" />
          New Topic
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <RiSearchLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search topics..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || 'all'}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              category: value === 'all' ? undefined : (value as TopicCategory),
            }))
          }
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {Object.values(TopicCategory).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <div className="rounded-full bg-destructive/10 p-3">
            <RiBookOpenLine className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">Failed to load topics</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : 'An error occurred'}
          </p>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
          <div className="rounded-full bg-muted p-3">
            <RiBookOpenLine className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No topics yet</h3>
          <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
            Get started by creating your first topic to organize your vocabulary
          </p>
          <Button onClick={() => setDialogOpen(true)} className="mt-4">
            <RiAddLine className="mr-2 h-4 w-4" />
            Create Topic
          </Button>
        </div>
      ) : (
        <>
          {/* Topic Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Showing {data.length} of {data.length} topics
            </p>
            {/* Pagination can be added here if needed */}
          </div>
        </>
      )}

      {/* Topic Dialog */}
      <TopicDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
