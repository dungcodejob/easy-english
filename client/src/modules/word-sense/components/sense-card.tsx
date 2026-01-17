import { Badge } from '@/shared/ui/shadcn/badge';
import { Card } from '@/shared/ui/shadcn/card';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import type { DictionarySense } from '../types/word-sense.types';

interface SenseCardProps {
  sense: DictionarySense;
  word?: string;
  isSelected: boolean;
  isRecommended?: boolean;
  onToggle: () => void;
}

const cefrColors: Record<string, string> = {
  A1: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  A2: 'bg-green-500/10 text-green-600 border-green-500/20',
  B1: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  B2: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
  C1: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  C2: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
};

export function SenseCard({
  sense,
  word,
  isSelected,
  isRecommended = false,
  onToggle,
}: SenseCardProps) {
  
  // Flatten synonyms into a limited list for chips
  const visibleSynonyms = sense.synonyms?.slice(0, 5) || [];
  const remainingSynonyms = (sense.synonyms?.length || 0) - visibleSynonyms.length;

  return (
    <Card
      onClick={onToggle}
      className={`relative overflow-hidden transition-all duration-200 cursor-pointer group ${
        isSelected
          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
          : 'hover:bg-muted/50 hover:border-muted-foreground/20'
      }`}
    >
      {/* Recommended indicator */}
      {isRecommended && (
        <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-500/10 text-amber-600 text-xs flex items-center gap-1 rounded-bl z-10">
          <Sparkles className="h-3 w-3" />
          Recommended
        </div>
      )}

      <div className="p-4 flex gap-4">
        {/* Left Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          
          {/* Definition Row: Badge + POS + Definition */}
          <div className="flex items-start gap-2">
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
               {sense.cefrLevel && (
                <Badge
                  variant="outline"
                  className={`h-5 px-1.5 text-[10px] font-bold ${cefrColors[sense.cefrLevel] ?? 'bg-muted'}`}
                >
                  {sense.cefrLevel}
                </Badge>
              )}
              <span className="text-xs font-mono text-muted-foreground uppercase bg-muted px-1.5 rounded">
                {sense.partOfSpeech}
              </span>
            </div>
            <p className="text-sm font-semibold leading-snug">
              {sense.definition}
            </p>
          </div>

          {/* Vietnamese Translation */}
          {sense.definitionVi && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
               <span className="shrink-0 text-amber-500 mt-0.5 text-[10px]">⭐</span>
               <span>{sense.definitionVi}</span>
            </div>
          )}

          {/* Examples List */}
          {sense.examples && sense.examples.length > 0 && (
            <ul className="mt-1 space-y-1 list-disc pl-4 marker:text-muted-foreground/50">
              {sense.examples.slice(0, 3).map((ex, idx) => (
                <li key={ex.id || idx} className="text-xs text-muted-foreground/80 leading-relaxed">
                  {highlightWord(ex.text, word)}
                </li>
              ))}
            </ul>
          )}

          {/* Synonyms Chips */}
          {visibleSynonyms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {visibleSynonyms.map((syn) => (
                <Badge 
                  key={syn} 
                  variant="secondary" 
                  className="px-1.5 py-0 h-5 text-[10px] font-normal text-muted-foreground bg-muted hover:bg-muted-foreground/10"
                >
                  {syn}
                </Badge>
              ))}
              {remainingSynonyms > 0 && (
                <span className="text-[10px] text-muted-foreground self-center px-1">
                  +{remainingSynonyms} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Image */}
        {sense.images && sense.images.length > 0 && (
          <div className="shrink-0">
            <img
              src={`https://cdn.azvocab.com${sense.images[0]}`}
              alt="illustration"
              className="w-24 h-24 rounded-lg object-cover border bg-muted"
              loading="lazy"
            />
          </div>
        )}
      </div>
      
      {/* Selected Overlay/Checkmark (Optional, mimicking "Already know" or just selected state) */}
      {isSelected && (
         <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-primary text-xs font-medium bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-primary/20">
            <div className="rounded-full bg-primary text-primary-foreground p-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            Selected
         </div>
      )}
    </Card>
  );
}

function highlightWord(text: string, word?: string): ReactNode[] {
    if (!word) return [text];
    
    // Create a safe regex that matches the word and common suffix variations
    // Note: This is a simple heuristic. For perfect stemming, we'd need a library.
    // Matching: word, word's, words, worded, wording (simple approach)
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedWord}(?:s|es|d|ed|ing|'s)?)`, 'gi');
    
    return text.split(regex).map((part, i) =>
        regex.test(part) ? <span key={i} className="font-semibold text-foreground underline decoration-primary/30 decoration-2 underline-offset-2">{part}</span> : part
    );
}
