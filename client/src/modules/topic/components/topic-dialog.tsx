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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage
} from '@shared/ui/shadcn/form';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useCreateTopic, useUpdateTopic } from '../hooks';
import { type Topic, type TopicCategory, topicCategory } from '../types';

import { Field, FieldGroup } from '@/shared/ui/shadcn/field';
import { useTranslation } from 'react-i18next';
import { languagePairOptions, topicCategoryOptions } from '../types/topic.meta';
// Validation schema
const topicSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
  category: z.enum(Object.values(topicCategory)),
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
  category: topicCategory.Vocabulary,
  tags: [],
  languagePair: 'EN-VI',
  coverImageUrl: '',
  isPublic: false,
};

export function TopicDialog({ open, onOpenChange, topic }: TopicDialogProps) {
  const { t } = useTranslation();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}

              <FieldGroup>
                            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Field>
                  <FormLabel>Topic Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Daily Conversations" {...field} />
                  </FormControl>
                  <FormMessage />
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <Field>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Short notes about this topic..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </Field>
              )}
            />




            {/* Category & Language Pair - Side by side */}
            <div className="grid grid-cols-2 gap-4">




              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Field>
                    <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                    <FormControl>

                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as TopicCategory)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {topicCategoryOptions.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                    </FormControl>
                    <FormMessage />
                  </Field>
                )}
              />


                            <FormField
                control={form.control}
                name="languagePair"
                render={({ field }) => (
                  <Field>
                    <FormLabel>Language Pair <span className="text-destructive">*</span></FormLabel>
                    <FormControl>

                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value as TopicCategory)}
                      >
                       <SelectTrigger>
                    <SelectValue placeholder="Select language pair" />
                  </SelectTrigger>
                  <SelectContent>

                    {languagePairOptions('EN').map((langPair) => (
                      <SelectItem key={langPair.value} value={langPair.value}>
                        {langPair.label}
                      </SelectItem>
                    ))}


                  </SelectContent>
                      </Select>

                    </FormControl>
                    
                    <FormMessage />
                  </Field>
                )}
              />


            </div>


              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <Field>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>

              <TagInput
                value={field.value}
                onChange={(tags) => field.onChange(tags)}
                placeholder="Type and press Enter to add tags..."
                maxTags={10}
              />

                 
                    </FormControl>
                     <FormDescription className='text-xs text-muted-foreground'>Add tags to help organize and search your topics</FormDescription>
                    <FormMessage />
                  </Field>
                )}
              />



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
              </FieldGroup>

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
        </Form>

      </DialogContent>
    </Dialog>
  );
}
