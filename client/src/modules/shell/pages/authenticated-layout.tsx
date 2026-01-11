import { RequireWorkspace } from '@/modules/workspace/components/require-workspace';
import { APP_ROUTES } from '@/shared/constants';
import { SidebarInset, SidebarProvider } from '@/shared/ui/shadcn/sidebar';
import { useAuthStore } from '@auth/stores';
import {
  createFileRoute,
  redirect,
  useLocation
} from '@tanstack/react-router';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppHeader } from '../features/app-header';
import { AppSidebar } from '../features/app-sidebar';
import SubSidebarMenu from '../features/sub-sidebar-menu';
import type { MenuItem } from '../ui/nav-group';

const uuid = () => {
  return Math.random().toString(36).substring(2);
};

const findCurrentMenuItem = (
  menuItems: MenuItem[],
  pathname: string,
): MenuItem | null => {
  for (const item of menuItems) {
    if (item.groups) {
      for (const g of item.groups) {
        const found = findCurrentMenuItem(g.items, pathname);
        if (found) {
          return found;
        }
      }
    }

    if (item.children) {
      const found = findCurrentMenuItem(item.children, pathname);
      if (found) {
        return found;
      }
    }
    if (item.url && pathname.startsWith(item.url)) {
      return item;
    }
  }
  return null;
};

export const Route = createFileRoute('/_(authenticated)')({
  component: AuthenticatedLayout,
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      // Redirect to login with redirect param
      throw redirect({
        to: APP_ROUTES.AUTH.LOGIN,
        search: { redirect: location.pathname },
        replace: true,
      });
      // Returning false prevents the route from loading
      // return false;
    }
    
    // Allow route to load
    return true;
  },
});

export function AuthenticatedLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();



  const activeItem = useMemo(() => {
    const current = findCurrentMenuItem(
    [],
      pathname,
    );
    if (!current || current.children?.length) {
      return null;
    }

    return current;
  }, [ pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <div className="flex h-full flex-col">
          {activeItem?.groups ? (
            <SubSidebarMenu title={activeItem.title} groups={activeItem.groups} />
          ) : (
            <div className="w-0" />
          )}

          <div className="flex-1">
            <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-1 flex-col self-stretch p-4">
              <RequireWorkspace />
            </div>
          </div>
        </div>        
      </SidebarInset>
    </SidebarProvider>
  );
}
