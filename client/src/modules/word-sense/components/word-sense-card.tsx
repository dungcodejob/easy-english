import { Badge } from '@/shared/ui/shadcn/badge';
import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent, CardHeader } from '@/shared/ui/shadcn/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/shared/ui/shadcn/collapsible';
import {
    BookOpen,
    ChevronDown,
    Edit2,
    Image,
    ThumbsUp,
    Trash2,
    Video,
    Volume2,
} from 'lucide-react';
import { useState } from 'react';
import {
    DifficultyLevel,
    LearningStatus,
    type UserWordSense,
} from '../../types/word-sense.types';

interface WordSenseCardProps {
  wordSense: UserWordSense;
  onEdit: (wordSense: UserWordSense) => void;
  onDelete: (wordSense: UserWordSense) => void;
}

const difficultyColors: Record<DifficultyLevel, string> = {
  [DifficultyLevel.Easy]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [DifficultyLevel.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [DifficultyLevel.Hard]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const statusColors: Record<LearningStatus, string> = {
  [LearningStatus.New]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [LearningStatus.Learning]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [LearningStatus.Reviewing]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  [LearningStatus.Mastered]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
};

const statusIcons: Record<LearningStatus, typeof BookOpen> = {
  [LearningStatus.New]: BookOpen,
  [LearningStatus.Learning]: BookOpen,
  [LearningStatus.Reviewing]: BookOpen,
  [LearningStatus.Mastered]: ThumbsUp,
};

export function WordSenseCard({ wordSense, onEdit, onDelete }: WordSenseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const StatusIcon = statusIcons[wordSense.learningStatus];
  const shortDefinition = wordSense.definition.length > 100
    ? wordSense.definition.substring(0, 100) + '...'
    : wordSense.definition;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-semibold truncate">{wordSense.word}</h3>
              <Badge variant="outline" className="text-xs">
                {wordSense.partOfSpeech}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {isExpanded ? wordSense.definition : shortDefinition}
            </p>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(wordSense)}
              className="h-8 w-8"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(wordSense)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-2">
          <Badge className={difficultyColors[wordSense.difficultyLevel]}>
            {wordSense.difficultyLevel}
          </Badge>
          <Badge className={statusColors[wordSense.learningStatus]}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {wordSense.learningStatus}
          </Badge>
          {wordSense.pronunciation && (
            <Badge variant="secondary" className="text-xs">
              <Volume2 className="h-3 w-3 mr-1" />
              {wordSense.pronunciation}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* Collapsible Details */}
      {(wordSense.examples && wordSense.examples .length > 0) ||
        (wordSense.synonyms && wordSense.synonyms.length > 0) ||
        (wordSense.antonyms && wordSense.antonyms.length > 0) ||
        (wordSense.media && (wordSense.media.images || wordSense.media.videos)) ? (
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center gap-2"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
              <span>{isExpanded ? 'Show Less' : 'Show More'}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-3 space-y-3">
              {/* Examples */}
              {wordSense.examples && wordSense.examples.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Examples:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {wordSense.examples.map((example, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Synonyms */}
              {wordSense.synonyms && wordSense.synonyms.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Synonyms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {wordSense.synonyms.map((synonym, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {synonym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms */}
              {wordSense.antonyms && wordSense.antonyms.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Antonyms:</h4>
                  <div className="flex flex-wrap gap-1">
                    {wordSense.antonyms.map((antonym, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {antonym}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Media */}
              {wordSense.media && (
                <div className="space-y-2">
                  {wordSense.media.images && wordSense.media.images.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Image className="h-4 w-4" />
                        Images:
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {wordSense.media.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${wordSense.word} visual ${idx + 1}`}
                            className="rounded border w-full h-24 object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {wordSense.media.videos && wordSense.media.videos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        Videos:
                      </h4>
                      <div className="space-y-1">
                        {wordSense.media.videos.map((video, idx) => (
                          <a
                            key={idx}
                            href={video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline block truncate"
                          >
                            {video}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      ) : null}
    </Card>
  );
}
