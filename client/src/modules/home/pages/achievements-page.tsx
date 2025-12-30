import { ComingSoonPage } from '@/modules/shell/pages/coming-soon-page';
import { createFileRoute } from '@tanstack/react-router';
import { Trophy } from 'lucide-react';

export const Route = createFileRoute('/_(authenticated)/achievements')({
  component: AchievementsPage,
});

function AchievementsPage() {
  return (
    <ComingSoonPage 
      title="Achievements"
      description="Unlock badges, celebrate milestones, and showcase your language learning accomplishments. Stay motivated with rewards and recognition."
      icon={
        <div className="rounded-full bg-linear-to-br from-yellow-500 to-orange-500 p-6 shadow-lg">
          <Trophy className="h-12 w-12 text-white" />
        </div>
      }
    />
  );
}
