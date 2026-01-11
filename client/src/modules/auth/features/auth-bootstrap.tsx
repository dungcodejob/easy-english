import { authApi } from '@/modules/auth/services';
import { useAuthStore } from '@/modules/auth/stores';
import { SplashScreen } from '@/shared/ui/common/splash-screen';
import React, { useEffect } from 'react';

export const AuthBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isBootstrapping, setBootstrapping, setAuth, logout } = useAuthStore();

  useEffect(() => {
    const bootstrap = async () => {
      const result = await authApi.silentRefresh();
      
      if (result.isOk()) {
        setAuth(result.value.data);
      } else {
        // If silent refresh fails, we ensure the user is logged out in the store
        // We don't necessarily need to redirect here because the route guard (RequireAuth)
        // will handle redirection if the user visits a protected route.
        // Public routes should remain accessible.
        await logout();
      }
      setBootstrapping(false);
    };
    bootstrap();
  }, [setBootstrapping, setAuth, logout]);

  if (isBootstrapping) {
    return <SplashScreen />;
  }

  return <>{children}</>;
};
