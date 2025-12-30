import { useAuthStore } from '@/modules/auth/stores';
import { useWorkspaceStore } from '@/modules/workspace/stores/workspace.store';
import { useEffect, useState } from 'react';

export const useAppInit = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated } = useAuthStore();
  const { fetchWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    const init = async () => {
      if (isAuthenticated) {
        await fetchWorkspaces();
      }
      setIsInitializing(false);
    };

    init();
  }, [isAuthenticated, fetchWorkspaces]);

  return { isInitializing };
};
