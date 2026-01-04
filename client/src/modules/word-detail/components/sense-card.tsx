import { Badge } from '@/shared/ui/shadcn/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';
import type { SenseDetailDto } from '../types/word-detail.types';

interface SenseCardProps {
  sense: SenseDetailDto;
}

export const SenseCard = ({ sense }: SenseCardProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Badge variant="outline">{sense.partOfSpeech}</Badge>
            {sense.cefrLevel && <Badge variant="secondary">{sense.cefrLevel}</Badge>}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-2">{sense.definition}</p>
        {sense.definitionVi && (
          <p className="text-gray-600 mb-4 italic">{sense.definitionVi}</p>
        )}
        
        {sense.examples.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Examples:</h4>
            <ul className="list-disc list-inside space-y-1">
              {sense.examples.map((ex, idx) => (
                <li key={idx} className="text-sm">
                  <span dangerouslySetInnerHTML={{ __html: ex.text }} />
                  {ex.translationVi && (
                    <span className="text-gray-500 block ml-4 text-xs">
                      {ex.translationVi}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
