import { ComingSoonPage } from '@/modules/shell/pages/coming-soon-page';
import { createFileRoute } from '@tanstack/react-router';
import { Settings } from 'lucide-react';

export const Route = createFileRoute('/_(authenticated)/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <ComingSoonPage 
      title="Settings"
      description="Customize your learning experience, manage your account preferences, and configure app settings to match your needs."
      icon={
        <div className="rounded-full bg-linear-to-br from-gray-500 to-slate-600 p-6 shadow-lg">
          <Settings className="h-12 w-12 text-white" />
        </div>
      }
    />
  );
}
