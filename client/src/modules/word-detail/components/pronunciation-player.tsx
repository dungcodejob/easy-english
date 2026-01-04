import { Button } from '@/shared/ui/shadcn/button';
import { Volume2 } from 'lucide-react';
import type { PronunciationDto } from '../types/word-detail.types';

interface PronunciationPlayerProps {
  pronunciations: PronunciationDto[];
}

export const PronunciationPlayer = ({ pronunciations }: PronunciationPlayerProps) => {
  const playAudio = (url: string) => {
    new Audio(url).play();
  };

  return (
    <div className="flex gap-2 items-center">
      {pronunciations.map((p, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="text-sm text-gray-500 uppercase">{p.region}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => p.audioUrl && playAudio(p.audioUrl)}
            disabled={!p.audioUrl}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          {p.ipa && <span className="font-mono text-sm">{p.ipa}</span>}
        </div>
      ))}
    </div>
  );
};
