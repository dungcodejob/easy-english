import { useValidationErrors } from '@/shared/hooks/use-validation-errors';
import type { AppError } from '@/shared/lib/errors/app-error';
import { TagInput } from '@/shared/ui/common/tag-input';
import { Button } from '@/shared/ui/shadcn/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/shadcn/dialog';
import { Input } from '@/shared/ui/shadcn/input';
import { Label } from '@/shared/ui/shadcn/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/shadcn/select';
import { Textarea } from '@/shared/ui/shadcn/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCreateTopic, useUpdateTopic } from '../hooks';
import { TopicCategory, type Topic } from '../types';

// Validation schema
const topicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  category: z.enum(TopicCategory),
  tags: z.array(z.string()),
  languagePair: z.string().min(1, 'Language pair is required'),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  isPublic: z.boolean(),
});

type TopicFormValues = z.infer<typeof topicSchema>;

interface TopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic?: Topic; // If provided, edit mode
}

const initialFormValues: TopicFormValues = {
  name: '',
  description: '',
  category: TopicCategory.VOCABULARY,
  tags: [],
  languagePair: 'EN-VI',
  coverImageUrl: '',
  isPublic: false,
};

export function TopicDialog({ open, onOpenChange, topic }: TopicDialogProps) {
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic();
  const isEditMode = !!topic;

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: topic ? {
      name: topic.name,
      description: topic.description,
      category: topic.category,
      tags: topic.tags,
      languagePair: topic.languagePair,
      coverImageUrl: topic.coverImageUrl,
      isPublic: topic.isPublic,
    } : initialFormValues,
  });

  useValidationErrors((createTopic.error || updateTopic.error) as unknown as AppError, form.setError);

  React.useEffect(() => {
    if (topic) {
      form.reset({
        name: topic.name,
        description: topic.description || '',
        category: topic.category,
        tags: topic.tags || [],
        languagePair: topic.languagePair,
        coverImageUrl: topic.coverImageUrl || '',
        isPublic: topic.isPublic,
      });
    }
  }, [topic, form]);

  const onSubmit = async (data: TopicFormValues) => {
    try {
      if (isEditMode) {
        await updateTopic.mutateAsync({ id: topic.id, data });
      } else {
        await createTopic.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Topic' : 'Create New Topic'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update your topic information below.'
              : 'Create a new topic to organize your vocabulary.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Topic Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Daily Conversations"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Short notes about this topic..."
              rows={3}
              {...form.register('description')}
            />
          </div>

          {/* Category & Language Pair - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label>
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch('category')}
                onValueChange={(value) => form.setValue('category', value as TopicCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(TopicCategory).map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Language Pair */}
            <div className="space-y-2">
              <Label htmlFor="languagePair">
                Language Pair <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.watch('languagePair')}
                onValueChange={(value) => form.setValue('languagePair', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language pair" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN-VI">English - Vietnamese</SelectItem>
                  <SelectItem value="EN-FR">English - French</SelectItem>
                  <SelectItem value="EN-ES">English - Spanish</SelectItem>
                  <SelectItem value="EN-DE">English - German</SelectItem>
                  <SelectItem value="EN-JA">English - Japanese</SelectItem>
                  <SelectItem value="EN-KO">English - Korean</SelectItem>
                  <SelectItem value="EN-ZH">English - Chinese</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.languagePair && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.languagePair.message}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput
              value={form.watch('tags')}
              onChange={(tags) => form.setValue('tags', tags)}
              placeholder="Type and press Enter to add tags..."
              maxTags={10}
            />
            <p className="text-xs text-muted-foreground">
              Add tags to help organize and search your topics
            </p>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">Cover Image URL</Label>
            <Input
              id="coverImageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              {...form.register('coverImageUrl')}
            />
            {form.formState.errors.coverImageUrl && (
              <p className="text-sm text-destructive">
                {form.formState.errors.coverImageUrl.message}
              </p>
            )}
            {form.watch('coverImageUrl') && (
              <div className="mt-2 rounded-lg border overflow-hidden">
                <img
                  src={form.watch('coverImageUrl')}
                  alt="Cover preview"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Is Public - Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              id="isPublic"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...form.register('isPublic')}
            />
            <Label htmlFor="isPublic" className="cursor-pointer">
              Make this topic public (allow sharing)
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTopic.isPending || updateTopic.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createTopic.isPending || updateTopic.isPending}
            >
              {isEditMode ? 'Update Topic' : 'Create Topic'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
