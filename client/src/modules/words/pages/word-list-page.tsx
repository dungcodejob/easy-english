import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCreateWord } from '../hooks/use-create-word';
import { useWords } from '../hooks/use-words';
// import { useUpdateWord } from '../hooks/use-update-word'; // Todo: create this hook
// import { useDeleteWord } from '../hooks/use-delete-word'; // Todo: create this hook
import { useTopicById } from '@/modules/topic/hooks';
import { QUERY_KEYS } from '@/shared/constants/key';
import { Button } from '@/shared/ui/shadcn/button';
import { Skeleton } from '@/shared/ui/shadcn/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { WordCard } from '../components/word-card';
import { WordDialog } from '../components/word-dialog';
import { wordApi } from '../services/word.api'; // Temporary direct use until hooks created
import type { Word } from '../types';

export const Route = createFileRoute('/_(authenticated)/topic/$topicId')({
  component: WordListPage,
});

export function WordListPage() {
  const { topicId } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  
  const { data: topic, isLoading: isTopicLoading } = useTopicById(topicId!);
  const { data: wordsData, isLoading: isWordsLoading } = useWords(topicId!);
  
  const createWord = useCreateWord(topicId!);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | undefined>(undefined);

  const handleCreate = async (data: any) => {
    await createWord.mutateAsync(data);
  };

  const handleUpdate = async (data: any) => {
    if (!editingWord) return;
    try {
      await wordApi.updateWord(editingWord.id, data);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
      toast.success(t('common.update_success'));
    } catch (e) {
      toast.error(t('common.update_error'));
    }
  };

  const handleDelete = async (word: Word) => {
    if (confirm(t('common.confirm_delete'))) {
       try {
        await wordApi.deleteWord(word.id);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WORD, topicId] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TOPIC] }); // update count
        toast.success(t('common.delete_success'));
      } catch (e) {
        toast.error(t('common.delete_error'));
      }
    }
  };

  if (isTopicLoading) {
    return <div className="p-8 space-y-4">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
      </div>
    </div>;
  }

  if (!topic) return <div>Topic not found</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="space-y-1">
          <Button variant="ghost" className="pl-0 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => navigate({to: '/topic'})}>
             <ArrowLeft className="mr-2 h-4 w-4" />
             Back to Topics
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{topic.name}</h1>
          <p className="text-muted-foreground">{topic.description || 'No description'}</p>
        </div>
        <Button onClick={() => { setEditingWord(undefined); setIsDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Word
        </Button>
      </div>

      {isWordsLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
         </div>
      ) : wordsData?.items?.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
          <h3 className="text-lg font-medium">No words yet</h3>
          <p className="text-muted-foreground mb-4">Start by adding new words to this topic.</p>
          <Button variant="outline" onClick={() => { setEditingWord(undefined); setIsDialogOpen(true); }}>
            Add your first word
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wordsData?.items?.map((word) => (
            <WordCard 
              key={word.id} 
              word={word} 
              onEdit={(w) => { setEditingWord(w); setIsDialogOpen(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <WordDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        topicId={topicId!}
        wordToEdit={editingWord}
        onSubmit={editingWord ? handleUpdate : handleCreate}
        isSubmitting={createWord.isPending}
      />
    </div>
  );
};
