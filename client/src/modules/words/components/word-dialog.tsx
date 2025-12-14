import { Button } from '@/shared/ui/shadcn/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/shared/ui/shadcn/form';
import { Input } from '@/shared/ui/shadcn/input';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/shadcn/tabs';
import { Textarea } from '@/shared/ui/shadcn/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useCreateWordFromOxford } from '../hooks/use-create-word-oxford';
import type { CreateWordDto, Word } from '../types';

const wordSchema = z.object({
  word: z.string().min(1, 'Word is required'),
  definition: z.string().optional(),
  pronunciation: z.string().optional(),
  example: z.string().optional(),
  personalNote: z.string().optional(),
});

type WordFormValues = z.infer<typeof wordSchema>;

interface WordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
  wordToEdit?: Word;
  onSubmit: (data: CreateWordDto) => Promise<void>;
  isSubmitting?: boolean;
}

export const WordDialog = ({
  open,
  onOpenChange,
  topicId,
  wordToEdit,
  onSubmit,
  isSubmitting,
}: WordDialogProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'manual' | 'oxford'>('manual');
  
  const createFromOxford = useCreateWordFromOxford(topicId);
  const [oxfordInput, setOxfordInput] = useState('');

  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordSchema),
    defaultValues: {
      word: '',
      definition: '',
      pronunciation: '',
      example: '',
      personalNote: '',
    },
  });

  useEffect(() => {
    if (wordToEdit) {
      form.reset({
        word: wordToEdit.word,
        definition: wordToEdit.definition || '',
        pronunciation: wordToEdit.pronunciation || '',
        example: wordToEdit.examples?.[0] || '',
        personalNote: wordToEdit.personalNote || '',
      });
      setActiveTab('manual');
    } else {
      form.reset({ word: '', definition: '', pronunciation: '', example: '', personalNote: '' });
      setActiveTab('oxford'); // Default to Oxford for new words as it's easier
    }
  }, [wordToEdit, open, form]);

  const handleSubmit = async (values: WordFormValues) => {
    await onSubmit({
      word: values.word,
      definition: values.definition,
      pronunciation: values.pronunciation,
      examples: values.example ? [values.example] : [],
      personalNote: values.personalNote,
    });
    onOpenChange(false);
  };

  const handleOxfordSubmit = async () => {
    if (!oxfordInput) return;
    try {
      await createFromOxford.mutateAsync(oxfordInput);
      setOxfordInput('');
      onOpenChange(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {wordToEdit ? t('word.edit_title') : t('word.add_title')}
          </DialogTitle>
          <DialogDescription>
            {wordToEdit ? t('word.edit_desc') : t('word.add_desc')}
          </DialogDescription>
        </DialogHeader>

        {!wordToEdit && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="oxford">Oxford Dictionary</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {activeTab === 'oxford' && !wordToEdit ? (
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type a word (e.g., 'serendipity')"
                value={oxfordInput}
                onChange={(e) => setOxfordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleOxfordSubmit()}
                autoFocus
              />
              <Button onClick={handleOxfordSubmit} disabled={createFromOxford.isPending || !oxfordInput}>
                {createFromOxford.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md">
              <p>We'll automatically fetch definition, pronunciation, audio, examples, and synonyms from Oxford Languages.</p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="word"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('word.fields.word')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Serendipity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="pronunciation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('word.fields.pronunciation')}</FormLabel>
                      <FormControl>
                        <Input placeholder="/ˌser.ənˈdɪp.ə.ti/" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="definition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('word.fields.definition')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="The occurrence and development of events by chance..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="example"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('word.fields.example')}</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: We found each other by pure serendipity." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t('common.save')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
