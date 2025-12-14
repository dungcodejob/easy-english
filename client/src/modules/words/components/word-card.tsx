import { Badge } from '@/shared/ui/shadcn/badge';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/ui/shadcn/card';
import { cn } from '@/shared/utils/tailwind';
import { Edit, Trash, Volume2 } from 'lucide-react';
import { useState } from 'react';
import type { Word } from '../types';

interface WordCardProps {
  word: Word;
  onEdit?: (word: Word) => void;
  onDelete?: (word: Word) => void;
  className?: string;
}

export const WordCard = ({ word, onEdit, onDelete, className }: WordCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = () => {
    if (word.audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(word.audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play().catch(() => setIsPlaying(false));
    }
  };

  return (
    <Card className={cn('group overflow-hidden transition-all hover:shadow-md', className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-foreground">{word.word}</h3>
              {word.pronunciation && (
                <span className="text-sm text-muted-foreground font-mono">{word.pronunciation}</span>
              )}
              {word.audioUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-6 w-6 rounded-full", isPlaying && "text-primary animate-pulse")}
                  onClick={playAudio}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            {word.partOfSpeech && word.partOfSpeech.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {word.partOfSpeech.map((pos) => (
                  <Badge key={pos} variant="secondary" className="text-xs px-1.5 py-0 h-5">
                    {pos}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {word.fromOxfordApi && (
            <Badge variant="outline" className="text-[10px] h-5 opacity-50" title="Sourced from Oxford Dictionary">
              Oxford
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2 space-y-3">
        {word.definition && (
          <p className="text-sm text-foreground/90 leading-relaxed">
            {word.definition}
          </p>
        )}
        
        {word.examples && word.examples.length > 0 && (
          <div className="bg-muted/30 p-2.5 rounded-md text-sm italic text-muted-foreground border-l-2 border-primary/20">
            "{word.examples[0]}"
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 bg-muted/5 flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(word)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete?.(word)}>
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
