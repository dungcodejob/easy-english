import { useAuthStore } from '@/modules/auth/stores';
import { APP_ROUTES } from '@/shared/constants';
import type { TypeSafe } from '@/shared/types';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { useWorkspaceStore } from '../stores/workspace.store';


export const Route = createFileRoute('/_(onboarding)')({
  component: OnboardingLayout,
  beforeLoad: ({ search }) => {
    const { currentWorkspaceId } = useWorkspaceStore.getState();
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated && currentWorkspaceId) {
      // Redirect to login with redirect param
      throw redirect({
        to: APP_ROUTES.ROOT,
        search: { redirect: (search as TypeSafe).redirect },
        replace: true,
      });
      // Returning false prevents the route from loading
      // return false;
    }

    // Allow route to load
    return true;
  },
});

export function OnboardingLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted p-4 md:p-10">
      <div className="w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
}
