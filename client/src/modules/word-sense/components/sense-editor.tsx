import { InputSelect } from '@/shared/ui/common';
import { Button } from '@/shared/ui/shadcn/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/shadcn/collapsible';
import { Field, FieldGroup } from '@/shared/ui/shadcn/field';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
} from '@/shared/ui/shadcn/form';
import { Input } from '@/shared/ui/shadcn/input';
import { Textarea } from '@/shared/ui/shadcn/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, MinusCircle, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { DifficultyLevel, LearningStatus } from '../types/word-sense.types';

// Validation schema
const senseEditorSchema = z.object({
  partOfSpeech: z.string().min(1, 'Part of speech is required'),
  definition: z
    .string()
    .min(1, 'Definition is required')
    .max(500, 'Definition must be less than 500 characters'),
  pronunciation: z.string().optional(),
  examples: z.array(z.object({ value: z.string() })).optional(),
  synonyms: z.array(z.object({ value: z.string() })).optional(),
  antonyms: z.array(z.object({ value: z.string() })).optional(),
  difficultyLevel: z.nativeEnum(DifficultyLevel),
  learningStatus: z.nativeEnum(LearningStatus),
  mediaImages: z.array(z.object({ value: z.string().url() })).optional(),
  mediaVideos: z.array(z.object({ value: z.string().url() })).optional(),
});

export type SenseEditorFormValues = z.infer<typeof senseEditorSchema>;

interface SenseEditorProps {
  initialData?: Partial<SenseEditorFormValues>;
  readOnlyFields?: string[];
  onSubmit: (data: SenseEditorFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

const partOfSpeechOptions = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
  { value: 'adverb', label: 'Adverb' },
  { value: 'pronoun', label: 'Pronoun' },
  { value: 'preposition', label: 'Preposition' },
  { value: 'conjunction', label: 'Conjunction' },
  { value: 'interjection', label: 'Interjection' },
];

const difficultyOptions = [
  { value: DifficultyLevel.Easy, label: 'Easy' },
  { value: DifficultyLevel.Medium, label: 'Medium' },
  { value: DifficultyLevel.Hard, label: 'Hard' },
];

const learningStatusOptions = [
  { value: LearningStatus.New, label: 'New' },
  { value: LearningStatus.Learning, label: 'Learning' },
  { value: LearningStatus.Reviewing, label: 'Reviewing' },
  { value: LearningStatus.Mastered, label: 'Mastered' },
];

export function SenseEditor({
  initialData,
  readOnlyFields = [],
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  onCancel,
}: SenseEditorProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const form = useForm<SenseEditorFormValues>({
    resolver: zodResolver(senseEditorSchema),
    defaultValues: {
      partOfSpeech: initialData?.partOfSpeech || '',
      definition: initialData?.definition || '',
      pronunciation: initialData?.pronunciation || '',
      examples: initialData?.examples || [],
      synonyms: initialData?.synonyms || [],
      antonyms: initialData?.antonyms || [],
      difficultyLevel: initialData?.difficultyLevel || DifficultyLevel.Easy,
      learningStatus: initialData?.learningStatus || LearningStatus.New,
      mediaImages: initialData?.mediaImages || [],
      mediaVideos: initialData?.mediaVideos || [],
    },
  });

  const {
    fields: exampleFields,
    append: appendExample,
    remove: removeExample,
  } = useFieldArray({
    control: form.control,
    name: 'examples',
  });

  const {
    fields: synonymFields,
    append: appendSynonym,
    remove: removeSynonym,
  } = useFieldArray({
    control: form.control,
    name: 'synonyms',
  });

  const {
    fields: antonymFields,
    append: appendAntonym,
    remove: removeAntonym,
  } = useFieldArray({
    control: form.control,
    name: 'antonyms',
  });

  const {
    fields: mediaImageFields,
    append: appendMediaImage,
    remove: removeMediaImage,
  } = useFieldArray({
    control: form.control,
    name: 'mediaImages',
  });

  const {
    fields: mediaVideoFields,
    append: appendMediaVideo,
    remove: removeMediaVideo,
  } = useFieldArray({
    control: form.control,
    name: 'mediaVideos',
  });

  const handleSubmit = (data: SenseEditorFormValues) => {
    onSubmit(data);
  };

  const isReadOnly = (fieldName: string) => readOnlyFields.includes(fieldName);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FieldGroup>
          {/* Part of Speech */}
          <FormField
            control={form.control}
            name="partOfSpeech"
            render={({ field }) => (
              <Field>
                <FormLabel>
                  Part of Speech <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    options={partOfSpeechOptions}
                    disabled={isReadOnly('partOfSpeech')}
                  />
                </FormControl>
                <FormMessage />
              </Field>
            )}
          />

          {/* Definition */}
          <FormField
            control={form.control}
            name="definition"
            render={({ field }) => (
              <Field>
                <FormLabel>
                  Definition <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the definition..."
                    rows={3}
                    {...field}
                    disabled={isReadOnly('definition')}
                  />
                </FormControl>
                <FormMessage />
              </Field>
            )}
          />

          {/* Pronunciation */}
          <FormField
            control={form.control}
            name="pronunciation"
            render={({ field }) => (
              <Field>
                <FormLabel>Pronunciation</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., /həˈloʊ/"
                    {...field}
                    disabled={isReadOnly('pronunciation')}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  IPA notation or phonetic spelling
                </FormDescription>
                <FormMessage />
              </Field>
            )}
          />

          {/* Examples */}
          <div className="space-y-2">
            <FormLabel>Examples</FormLabel>
            {exampleFields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input
                  placeholder="Enter an example sentence..."
                  {...form.register(`examples.${index}.value` as const)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExample(index)}
                >
                  <MinusCircle className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendExample({ value: '' })}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Example
            </Button>
          </div>

          {/* Difficulty and Status - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="difficultyLevel"
              render={({ field }) => (
                <Field>
                  <FormLabel>Difficulty</FormLabel>
                  <FormControl>
                    <InputSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={difficultyOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </Field>
              )}
            />

            <FormField
              control={form.control}
              name="learningStatus"
              render={({ field }) => (
                <Field>
                  <FormLabel>Learning Status</FormLabel>
                  <FormControl>
                    <InputSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      options={learningStatusOptions}
                    />
                  </FormControl>
                  <FormMessage />
                </Field>
              )}
            />
          </div>

          {/* Advanced Fields - Collapsible */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="flex items-center gap-2 w-full justify-start"
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isAdvancedOpen ? 'rotate-180' : ''
                  }`}
                />
                <span>Advanced Options</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Synonyms */}
              <div className="space-y-2">
                <FormLabel>Synonyms</FormLabel>
                {synonymFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder="Enter a synonym..."
                      {...form.register(`synonyms.${index}.value` as const)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSynonym(index)}
                    >
                      <MinusCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSynonym({ value: '' })}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Synonym
                </Button>
              </div>

              {/* Antonyms */}
              <div className="space-y-2">
                <FormLabel>Antonyms</FormLabel>
                {antonymFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      placeholder="Enter an antonym..."
                      {...form.register(`antonyms.${index}.value` as const)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAntonym(index)}
                    >
                      <MinusCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendAntonym({ value: '' })}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Antonym
                </Button>
              </div>

              {/* Media - Images */}
              <div className="space-y-2">
                <FormLabel>Images (URLs)</FormLabel>
                {mediaImageFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      {...form.register(`mediaImages.${index}.value` as const)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMediaImage(index)}
                    >
                      <MinusCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendMediaImage({ value: '' })}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Image URL
                </Button>
              </div>

              {/* Media - Videos */}
              <div className="space-y-2">
                <FormLabel>Videos (URLs)</FormLabel>
                {mediaVideoFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      {...form.register(`mediaVideos.${index}.value` as const)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMediaVideo(index)}
                    >
                      <MinusCircle className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendMediaVideo({ value: '' })}
                  className="w-full"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Video URL
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </FieldGroup>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
