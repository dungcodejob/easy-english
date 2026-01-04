import { RelatedWords } from '@/modules/word-detail/components/related-words';
import { SenseCard } from '@/modules/word-detail/components/sense-card';
import { WordFamily } from '@/modules/word-detail/components/word-family';
import { WordHeader } from '@/modules/word-detail/components/word-header';
import { useWordDetail } from '@/modules/word-detail/hooks/use-word-detail';
import { createFileRoute } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

export const Route = createFileRoute('/_(authenticated)/dictionary/$keyword')({
  component: WordDetailPage,
});

function WordDetailPage() {
  const { keyword } = Route.useParams();
  const { data: wordDetail, isLoading, error } = useWordDetail(keyword);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error loading word: {error.message}
      </div>
    );
  }

  if (!wordDetail) {
    return <div className="p-4 text-center">Word not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <WordHeader wordDetail={wordDetail} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Definitions</h2>
          {wordDetail.senses.map((sense, index) => (
            <div key={sense.id || index}>
              <SenseCard sense={sense} />
              
              <div className="mt-2 space-y-2">
                 <RelatedWords title="Synonyms" items={sense.synonyms || []} variant="secondary" />
                 <RelatedWords title="Antonyms" items={sense.antonyms || []} variant="destructive" />
                 <RelatedWords title="Idioms" items={sense.idioms || []} variant="outline" />
                 <RelatedWords title="Phrases" items={sense.phrases || []} variant="default" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
           {wordDetail.wordFamily && (
             <WordFamily family={wordDetail.wordFamily} />
           )}
        </div>
      </div>
    </div>
  );
}
