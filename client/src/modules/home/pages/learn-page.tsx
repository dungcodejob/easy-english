import { ComingSoonPage } from '@/modules/shell/pages/coming-soon-page';
import { createFileRoute } from '@tanstack/react-router';
import { GraduationCap } from 'lucide-react';

export const Route = createFileRoute('/_(authenticated)/learn')({
  component: LearnPage,
});

function LearnPage() {
  return (
    <ComingSoonPage 
      title="Learn New Words"
      description="Start your learning journey! Discover new vocabulary, practice pronunciation, and expand your language skills with interactive lessons."
      icon={
        <div className="rounded-full bg-linear-to-br from-blue-500 to-purple-500 p-6 shadow-lg">
          <GraduationCap className="h-12 w-12 text-white" />
        </div>
      }
    />
  );
}
