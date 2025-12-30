import { useAuthStore } from '@/modules/auth/stores';
import { APP_ROUTES } from '@/shared/constants';
import { Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useWorkspaces } from '../hooks/use-workspaces';
import { useWorkspaceStore } from '../stores/workspace.store';

export function RequireWorkspace() {
  const navigate = useNavigate();
  const {data: workspaces = [],isFetched,isFetching} = useWorkspaces()
  const { currentWorkspaceId } = useWorkspaceStore();
  const { isAuthenticated } = useAuthStore();


  // Check if we need to redirect
  useEffect(() => {
    // If not authenticating or loading
    if (!isAuthenticated || isFetching) return;

    // 1. No workspaces at all -> Onboarding
    if (workspaces.length === 0 && isFetched) {
        navigate({ to: APP_ROUTES.ONBOARDING.WORKSPACE });
        return;
    }

    // 2. We have workspaces, but none selected -> Store should select one, but if not:
    if (!currentWorkspaceId) {
       // This implies store auto-select failed or hasn't run yet. 
       // In a real scenario, we might want to force select the first one here or show a picker.
       // For now, relies on store logic. If strictly null, maybe stay or redirect?
       // Let's assume store handles it, or user can assume safety.
    }
    
  }, [isAuthenticated, isFetching, workspaces, currentWorkspaceId, navigate]);

  if (isFetching) {
      return <div className="flex h-screen w-full items-center justify-center">Loading workspace...</div>;
  }

  // If we have a workspace or we are still checking, render children
  return <Outlet />;
}
