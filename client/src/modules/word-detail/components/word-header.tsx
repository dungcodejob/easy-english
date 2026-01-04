import { Badge } from '@/shared/ui/shadcn/badge';
import type { WordDetailResponseDto } from '../types/word-detail.types';
import { PronunciationPlayer } from './pronunciation-player';

interface WordHeaderProps {
  wordDetail: WordDetailResponseDto;
}

export const WordHeader = ({ wordDetail }: WordHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold text-primary">{wordDetail.text}</h1>
        {wordDetail.frequency && (
          <Badge variant="secondary">Freq: {wordDetail.frequency}</Badge>
        )}
        {wordDetail.rank && (
          <Badge variant="outline">Rank: {wordDetail.rank}</Badge>
        )}
      </div>
      <PronunciationPlayer pronunciations={wordDetail.pronunciations} />
    </div>
  );
};
