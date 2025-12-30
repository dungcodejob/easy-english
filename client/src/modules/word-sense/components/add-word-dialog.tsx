import { Badge } from '@/shared/ui/shadcn/badge';
import { Button } from '@/shared/ui/shadcn/button';
import { Card } from '@/shared/ui/shadcn/card';
import { Checkbox } from '@/shared/ui/shadcn/checkbox';
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
import { toast } from '@/shared/utils/toast';
import { ArrowLeft, BookOpen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useCreateWordSense } from '../hooks/use-create-word-sense';
import { useDictionary } from '../hooks/use-dictionary';
import { DifficultyLevel, LearningStatus, type CreateUserWordSenseDtoItem, type DictionarySense } from '../types/word-sense.types';
import { formValuesToCreateDtoItem } from '../utils/adapters';
import { SenseEditor, type SenseEditorFormValues } from './sense-editor';

type Step = 'input' | 'selection' | 'editor';

interface AddWordDialogProps {
  topicId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'fr', label: 'French' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
];

export function AddWordDialog({ topicId, open, onOpenChange }: AddWordDialogProps) {
  const [step, setStep] = useState<Step>('input');
  const [word, setWord] = useState<string>('');
  const [language, setLanguage] = useState('en');
  const [selectedSenses, setSelectedSenses] = useState<DictionarySense[]>([]);
  const [currentSenseIndex, setCurrentSenseIndex] = useState(0);
  const [senseForms, setSenseForms] = useState<SenseEditorFormValues[]>([]);

  const dictionaryMutation = useDictionary();
  const createWordSense = useCreateWordSense(topicId);

  const handleLookup = async () => {
    if (!word.trim()) {
      toast.error('Please enter a word');
      return;
    }

    try {
      await dictionaryMutation.mutateAsync({ 
        word: word.trim(), 
        language 
      });
      setStep('selection');
    } catch (error) {
      toast.error('Word not found in dictionary');
    }
  };

  const handleSkipLookup = () => {
    setSelectedSenses([]);
    setStep('editor');
  };

  const handleSenseToggle = (sense: DictionarySense) => {
    setSelectedSenses((prev) => {
      const exists = prev.find((s) => s.id === sense.id);
      if (exists) {
        return prev.filter((s) => s.id !== sense.id);
      }
      return [...prev, sense];
    });
  };

  const handleContinueToEditor = () => {
    if (selectedSenses.length === 0) {
      toast.error('Please select at least one sense or skip lookup to add manually');
      return;
    }
    // Initialize form data from selected senses
    setSenseForms(
      selectedSenses.map((sense) => ({
        partOfSpeech: sense.partOfSpeech,
        definition: sense.definition,
        pronunciation: dictionaryMutation.data?.pronunciations?.[0]?.ipa || '',
        examples: sense.examples?.map((v) => ({ value: v })) || [],
        synonyms: sense.synonyms?.map((v) => ({ value: v })) || [],
        antonyms: sense.antonyms?.map((v) => ({ value: v })) || [],
        difficultyLevel: DifficultyLevel.Easy,
        learningStatus: LearningStatus.New,
        mediaImages: [],
        mediaVideos: [],
      }))
    );
    setCurrentSenseIndex(0);
    setStep('editor');
  };

  const handleSenseEditorSubmit = (data: SenseEditorFormValues) => {
    const updatedForms = [...senseForms];
    updatedForms[currentSenseIndex] = data;
    setSenseForms(updatedForms);

    // If there are more senses, go to next
    if (currentSenseIndex < senseForms.length - 1) {
      setCurrentSenseIndex(currentSenseIndex + 1);
    } else {
      // All senses have been edited, submit
      handleFinalSubmit(updatedForms);
    }
  };

  const handleManualSubmit = (data: SenseEditorFormValues) => {
    handleFinalSubmit([data]);
  };

  const handleFinalSubmit = async (forms: SenseEditorFormValues[]) => {
    const senses: CreateUserWordSenseDtoItem[] = forms.map((form, index) =>
      formValuesToCreateDtoItem(form, {
        topicId,
        word: word.trim(),
        language,
        dictionarySenseId:
          selectedSenses.length > 0
            ? selectedSenses[index]?.id
            : undefined,
      })
    );

    try {
      await createWordSense.mutateAsync({ senses });
      handleClose();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state
    setTimeout(() => {
      setStep('input');
      setWord('');
      setLanguage('en');
      setWord('');
      setSelectedSenses([]);
      setCurrentSenseIndex(0);
      setSenseForms([]);
    }, 300);
  };

  const handleBack = () => {
    if (step === 'selection') {
      setStep('input');
    } else if (step === 'editor') {
      if (selectedSenses.length > 0) {
        setStep('selection');
      } else {
        setStep('input');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step !== 'input' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <DialogTitle>Add Word to Topic</DialogTitle>
              <DialogDescription>
                {step === 'input' && 'Lookup a word from dictionary or add manually'}
                {step === 'selection' && `Select senses for "${word}"`}
                {step === 'editor' &&
                  `Customize sense ${currentSenseIndex + 1}${senseForms.length > 1 ? ` of ${senseForms.length}` : ''}`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Step 1: Word Input */}
        {step === 'input' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="word">
                Word <span className="text-destructive">*</span>
              </Label>
              <Input
                id="word"
                placeholder="Enter a word..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !dictionaryMutation.isPending) {
                    handleLookup();
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">
                Language <span className="text-destructive">*</span>
              </Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={handleLookup} disabled={dictionaryMutation.isPending || !word.trim()}>
                {dictionaryMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <BookOpen className="h-4 w-4 mr-2" />
                Lookup from Dictionary
              </Button>
              <Button variant="outline" onClick={handleSkipLookup} disabled={!word.trim()}>
                Skip lookup and add manually
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Sense Selection */}
        {step === 'selection' && dictionaryMutation.data && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Select one or more senses to add to your topic:
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {dictionaryMutation.data.senses.map((sense) => (
                <Card
                  key={sense.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedSenses.find((s) => s.id === sense.id)
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleSenseToggle(sense)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={!!selectedSenses.find((s) => s.id === sense.id)}
                      onCheckedChange={() => handleSenseToggle(sense)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{sense.partOfSpeech}</Badge>
                        <span className="text-xs text-muted-foreground">
                          Sense {sense.senseIndex + 1}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{sense.definition}</p>
                      {sense.examples && sense.examples.length > 0 && (
                        <p className="text-xs text-muted-foreground italic">
                          Example: {sense.examples[0]}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleSkipLookup}>
                Add manually instead
              </Button>
              <Button onClick={handleContinueToEditor} disabled={selectedSenses.length === 0}>
                Continue ({selectedSenses.length} selected)
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 3: Sense Editor */}
        {step === 'editor' && (
          <div className="space-y-4">
            {senseForms.length > 0 ? (
              <>
                {senseForms.length > 1 && (
                  <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm font-medium">
                      Editing sense {currentSenseIndex + 1} of {senseForms.length}
                    </span>
                    <div className="flex gap-1">
                      {senseForms.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 w-2 rounded-full ${
                            idx === currentSenseIndex ? 'bg-primary' : 'bg-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <SenseEditor
                  initialData={senseForms[currentSenseIndex]}
                  onSubmit={handleSenseEditorSubmit}
                  isSubmitting={createWordSense.isPending}
                  submitLabel={
                    currentSenseIndex < senseForms.length - 1 ? 'Next Sense' : 'Save All'
                  }
                  onCancel={handleClose}
                />
              </>
            ) : (
              <SenseEditor
                onSubmit={handleManualSubmit}
                isSubmitting={createWordSense.isPending}
                submitLabel="Add Word"
                onCancel={handleClose}
              />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
