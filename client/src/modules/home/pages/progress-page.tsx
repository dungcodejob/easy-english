import { ComingSoonPage } from '@/modules/shell/pages/coming-soon-page';
import { createFileRoute } from '@tanstack/react-router';
import { TrendingUp } from 'lucide-react';

export const Route = createFileRoute('/_(authenticated)/progress')({
  component: ProgressPage,
});

function ProgressPage() {
  return (
    <ComingSoonPage 
      title="Your Progress"
      description="Track your learning achievements, view detailed statistics, and monitor your improvement over time with comprehensive analytics and insights."
      icon={
        <div className="rounded-full bg-linear-to-br from-green-500 to-emerald-500 p-6 shadow-lg">
          <TrendingUp className="h-12 w-12 text-white" />
        </div>
      }
    />
  );
}
