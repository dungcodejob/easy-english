import { Badge } from '@/shared/ui/shadcn/badge';
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
import { ScrollArea } from "@shared/ui/shadcn/scroll-area";
import { ArrowLeft, BookOpen, Loader2, Volume2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from "sonner";
import { useCreateWordSense } from '../hooks/use-create-word-sense';
import { useDictionary } from '../hooks/use-dictionary';
import { DifficultyLevel, LearningStatus, type CreateUserWordSenseDtoItem, type DictionarySense } from '../types/word-sense.types';
import { formValuesToCreateDtoItem } from '../utils/adapters';
import { SenseCard } from './sense-card';
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
  
  // UX Enhancements State
  const [isPlaying, setIsPlaying] = useState(false);
  const [cefrFilter, setCefrFilter] = useState<string>('all');
  const audioRef = useRef<HTMLAudioElement>(null);

  const dictionaryMutation = useDictionary();
  const createWordSense = useCreateWordSense(topicId);

  // Filter Senses Logic
  const filteredSenses = useMemo(() => {
    if (!dictionaryMutation.data?.senses) return [];
    if (cefrFilter === 'all') return dictionaryMutation.data.senses;
    
    const levels = cefrFilter.split('-'); // 'A1-A2' -> ['A1', 'A2']
    return dictionaryMutation.data.senses.filter(s => 
      levels.includes(s.cefrLevel ?? '')
    );
  }, [dictionaryMutation.data?.senses, cefrFilter]);

  // Audio Playback Logic
  const handlePlayAudio = () => {
    const audioUrl = dictionaryMutation.data?.pronunciations?.[0]?.audioUrl;
    if (audioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        setIsPlaying(true);
        audioRef.current.src = `https://cdn.azvocab.com${audioUrl}`;
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
          toast.error('Could not play audio');
        });
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    if (step !== 'selection' || !open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-9 to toggle selection
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (filteredSenses[index]) {
          e.preventDefault();
          handleSenseToggle(filteredSenses[index]);
        }
      }
      
      // Enter to confirm if selection exists
      if (e.key === 'Enter' && selectedSenses.length > 0) {
        e.preventDefault();
        handleContinueToEditor();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, open, filteredSenses, selectedSenses]);

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

  const handleSelectAllVisible = () => {
    const newSenses = filteredSenses.filter(s => 
      !selectedSenses.some(selected => selected.id === s.id)
    );
    setSelectedSenses(prev => [...prev, ...newSenses]);
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
        examples: sense.examples?.map((ex) => ({ value: ex.text })) || [],
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
      setCefrFilter('all');
      setIsPlaying(false);
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

  const hasAudio = !!dictionaryMutation.data?.pronunciations?.[0]?.audioUrl;

  return (
    <Dialog open={open} onOpenChange={handleClose}  >
      <DialogContent className="!max-w-[50rem] !w-[50rem] max-h-[90vh]">
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
              <div className="flex items-center gap-3">
                <DialogTitle>Add Word to Topic</DialogTitle>
                
                {/* Selected Count Badge (Moved here) */}
                {step === 'selection' && selectedSenses.length > 0 && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    {selectedSenses.length} selected
                  </Badge>
                )}

                {/* Audio Playback Button */}
                {step === 'selection' && hasAudio && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handlePlayAudio}
                    className={`h-6 w-6 rounded-full transition-colors ${isPlaying ? 'text-primary bg-primary/10' : 'text-muted-foreground'}`}
                  >
                    <Volume2 className={`h-4 w-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </Button>
                )}
                <audio 
                  ref={audioRef} 
                  onEnded={() => setIsPlaying(false)} 
                  onPause={() => setIsPlaying(false)}
                  className="hidden" 
                />
              </div>

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
            {/* Header info with Filters */}
            <div className="flex flex-col gap-3 sticky top-0 bg-background z-10 pb-2 border-b">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Select meanings ({filteredSenses.length} visible)
                </p>
              </div>

              {/* CEFR Level Filters */}
              <div className="flex flex-wrap gap-2 items-center">
                {['all', 'A1-A2', 'B1-B2', 'C1-C2'].map(filter => (
                  <Button
                    key={filter}
                    variant={cefrFilter === filter ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setCefrFilter(filter)}
                  >
                    {filter === 'all' ? 'All Levels' : filter}
                  </Button>
                ))}
                <div className="ml-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs"
                    onClick={handleSelectAllVisible}
                    disabled={filteredSenses.length === 0}
                  >
                    Select All Visible
                  </Button>
                </div>
              </div>
            </div>

            {/* Sense cards */}
            <ScrollArea className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 scroll-smooth">
              {filteredSenses.length > 0 ? (
                filteredSenses.map((sense, index) => (
                  <SenseCard
                    key={sense.id}
                    sense={sense}
                    word={word}
                    isSelected={!!selectedSenses.find((s) => s.id === sense.id)}
                    isRecommended={index === 0 && sense.cefrLevel === 'A1'}
                    onToggle={() => handleSenseToggle(sense)}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg">
                  No senses found for this filter
                </div>
              )}
            </ScrollArea>

            {/* Footer with dynamic CTA */}
            <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t items-center sm:items-stretch">
              <div className="flex-1 text-xs text-muted-foreground text-center sm:text-left hidden sm:block">
               💡 Press <kbd className="font-mono bg-muted px-1 rounded">1</kbd>-<kbd className="font-mono bg-muted px-1 rounded">9</kbd> to select, <kbd className="font-mono bg-muted px-1 rounded">Enter</kbd> to confirm
              </div>
              <Button
                variant="ghost"
                onClick={handleSkipLookup}
                className="text-muted-foreground"
              >
                Add manually instead
              </Button>
              <Button
                onClick={handleContinueToEditor}
                disabled={selectedSenses.length === 0}
                className="min-w-[160px]"
              >
                {selectedSenses.length === 0
                  ? 'Select at least one'
                  : selectedSenses.length === 1
                    ? 'Add 1 meaning'
                    : `Add ${selectedSenses.length} meanings`}
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
