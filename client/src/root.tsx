import { Outlet, createRootRoute } from '@tanstack/react-router';
import * as React from 'react';

import { Providers } from './shared/contexts';
import { Toaster } from './shared/ui/shadcn/sonner';
// import { Providers } from './providers/providers';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Providers>
        <Toaster position="top-center" />
        <Outlet />
        {/* <TanStackRouterDevtools position="bottom-left" /> */}
      </Providers>
    </React.Fragment>
  );
}
