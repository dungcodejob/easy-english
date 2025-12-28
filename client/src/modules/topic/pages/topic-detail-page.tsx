import { AddWordDialog } from '@/modules/word-sense/components/add-word-dialog';
import { EditWordSenseDialog } from '@/modules/word-sense/components/edit-word-sense-dialog';
import { WordSenseList } from '@/modules/word-sense/components/word-sense-list';
import type { UserWordSense } from '@/modules/word-sense/types/word-sense.types';
import { Button } from '@/shared/ui/shadcn/button';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTopicById } from '../hooks/use-topic-by-id';

export const Route = createFileRoute('/_(authenticated)/topic/$topicId')({
  component: TopicDetailPage,
});

export function TopicDetailPage() {
  const { topicId } = Route.useParams();
  const navigate = Route.useNavigate();

  const { data: topic, isLoading: isTopicLoading } = useTopicById(topicId);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWordSense, setEditingWordSense] = useState<UserWordSense | undefined>(
    undefined
  );

  const handleEdit = (wordSense: UserWordSense) => {
    setEditingWordSense(wordSense);
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    // Delete is handled in the WordSenseCard component with confirmation
  };

  const handleAddWord = () => {
    setIsAddDialogOpen(true);
  };

  if (isTopicLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="pl-0 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate({ to: '/topic' })}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Topics
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {topic.name}
          </h1>
          <p className="text-muted-foreground">{topic.description || 'No description'}</p>
        </div>
        <Button onClick={handleAddWord}>
          <Plus className="mr-2 h-4 w-4" />
          Add Word
        </Button>
      </div>

      {/* Word Sense List */}
      <WordSenseList
        topicId={topicId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddWord={handleAddWord}
      />

      {/* Add Word Dialog */}
      <AddWordDialog
        topicId={topicId}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      {/* Edit Word Sense Dialog */}
      {editingWordSense && (
        <EditWordSenseDialog
          wordSense={editingWordSense}
          topicId={topicId}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setEditingWordSense(undefined);
            }
          }}
        />
      )}
    </div>
  );
}
