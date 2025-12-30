import { ComingSoonPage } from '@/modules/shell/pages/coming-soon-page';
import { createFileRoute } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

export const Route = createFileRoute('/_(authenticated)/add-word')({
  component: AddWordPage,
});

function AddWordPage() {
  return (
    <ComingSoonPage 
      title="Add New Word"
      description="Quickly add new vocabulary to your learning collection. Create custom word entries with definitions, examples, and more."
      icon={
        <div className="rounded-full bg-linear-to-br from-indigo-500 to-purple-500 p-6 shadow-lg">
          <Plus className="h-12 w-12 text-white" />
        </div>
      }
    />
  );
}
