import { Button } from '@/shared/ui/shadcn/button';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import { BookOpen } from 'lucide-react';
import { useWordSenses } from '../../hooks/use-word-senses';
import type { UserWordSense } from '../../types/word-sense.types';
import { WordSenseCard } from './word-sense-card';

interface WordSenseListProps {
  topicId: string;
  onEdit: (wordSense: UserWordSense) => void;
  onDelete: (wordSense: UserWordSense) => void;
  onAddWord: () => void;
}

export function WordSenseList({
  topicId,
  onEdit,
  onDelete,
  onAddWord,
}: WordSenseListProps) {
  const { data, isLoading } = useWordSenses(topicId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const wordSenses = data?.items || [];

  if (wordSenses.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No words yet</h3>
        <p className="text-muted-foreground mb-4">
          Start building your vocabulary by adding words to this topic.
        </p>
        <Button onClick={onAddWord}>Add your first word</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wordSenses.map((wordSense) => (
        <WordSenseCard
          key={wordSense.id}
          wordSense={wordSense}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
