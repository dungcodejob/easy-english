
import { useReviewStats } from '@/modules/shell/hooks/use-header-data';
import { ComingSoonPage } from '@/modules/shell/pages/coming-soon-page';
import { ReviewHeader } from '@/modules/shell/ui/headers';
import { PageWithHeaderLayout } from '@/modules/shell/ui/layouts/page-with-header-layout';
import { createFileRoute } from '@tanstack/react-router';
import { Flame } from 'lucide-react';

export const Route = createFileRoute('/_(authenticated)/review')({
  component: ReviewPage,
});

function ReviewPage() {
  const reviewStats = useReviewStats();

  return (  
    <PageWithHeaderLayout 
      header={<ReviewHeader {...reviewStats} />}
    >
      <ComingSoonPage 
        title="Today Review"
        description="Your daily SRS (Spaced Repetition System) review session will be available here. Keep track of your learning progress and review words at optimal intervals."
        icon={
          <div className="rounded-full bg-linear-to-br from-orange-500 to-red-500 p-6 shadow-lg">
            <Flame className="h-12 w-12 text-white" />
          </div>
        }
      />
    </PageWithHeaderLayout>
  );
}
