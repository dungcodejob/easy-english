import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';
import type { WordFamilyDto } from '../types/word-detail.types';

interface WordFamilyProps {
  family: WordFamilyDto;
}

export const WordFamily = ({ family }: WordFamilyProps) => {
  if (!family) return null;

  const renderGroup = (label: string, items?: string[]) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-2">
        <span className="font-medium text-sm text-gray-700">{label}: </span>
        <span className="text-sm">{items.join(', ')}</span>
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Word Family</CardTitle>
      </CardHeader>
      <CardContent>
        {renderGroup('Nouns', family.n)}
        {renderGroup('Verbs', family.v)}
        {renderGroup('Adjectives', family.adj)}
        {renderGroup('Adverbs', family.adv)}
      </CardContent>
    </Card>
  );
};
