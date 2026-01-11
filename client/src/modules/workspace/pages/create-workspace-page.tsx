import { createFileRoute } from '@tanstack/react-router';
import { WorkspaceWizard } from '../components/wizard/workspace-wizard';

export const Route = createFileRoute(`/_(onboarding)/onboarding/workspace`)({
  component: CreateWorkspacePage,
});

export default function CreateWorkspacePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="w-full">
            <WorkspaceWizard />
        </div>
    </div>
  );
}
