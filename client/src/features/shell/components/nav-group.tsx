'use client';
import type { LucideIcon } from 'lucide-react';

import { useSidebar } from '@/components/ui/sidebar';
import type { RemixiconComponentType } from '@remixicon/react';
import { useLocation } from '@tanstack/react-router';
import { NavItem } from './nav-item';
import { NavItemCollapse } from './nav-item-collapse';

export type MenuGroup = {
  id: string;
  title: string;
  url?: string;
  items: MenuItem[];
};

export type MenuItem = {
  id: string;
  title: string;
  url?: string;
  icon?: LucideIcon | RemixiconComponentType;
  children?: MenuItem[];
  groups?: MenuGroup[];
  shortcut?: string;
  isActive?: boolean;
  permissionKey?: string;
  isHideChildren?: boolean;
  isShowSubSidebar?: boolean;
  isHidden?: boolean;
};

type NavProps = {
  isOpen?: boolean;
  items: MenuItem[];
  title: string;
};

export function NavGroup({ items, title, isOpen }: NavProps) {
  const { pathname } = useLocation();
  const { open } = useSidebar();

  const isSidebarCollapsed = !open;

  return (
    <div
      data-collapsed={isSidebarCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="flex flex-col gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {!isSidebarCollapsed && (
          <div className="relative flex w-full items-center px-2 py-1 text-xs font-medium text-sidebar-foreground/70">
            {title}
          </div>
        )}
        {items.map((item, index) =>
          item.children ? (
            <NavItemCollapse
              key={item.id}
              item={item}
              isCollapsed={isSidebarCollapsed}
              isOpen={isOpen}
            />
          ) : (
            <NavItem
              key={item.id}
              item={item}
              isCollapsed={isSidebarCollapsed}
              isActive={!!item.url && pathname.startsWith(item.url)}
            />
          ),
        )}
      </nav>
    </div>
  );
}
