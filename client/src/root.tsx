import { Outlet, createRootRoute } from '@tanstack/react-router';
import * as React from 'react';

import { Providers, useTheme } from './shared/contexts';
import { Toaster } from './shared/ui/shadcn/sonner';
// import { Providers } from './providers/providers';

export const  ToasterProvider = () => {
  const { resolvedTheme } = useTheme();
  const toastTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
  return <Toaster position="top-center"
  theme={toastTheme}
  richColors />;
}


export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  
  return (
    <React.Fragment>
      <Providers>
        <ToasterProvider />
        <Outlet />
        {/* <TanStackRouterDevtools position="bottom-left" /> */}
      </Providers>
    </React.Fragment>
  );
}
