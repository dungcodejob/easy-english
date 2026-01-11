'use client';
import type { LucideIcon } from 'lucide-react';

import { useSidebar } from '@/shared/ui/shadcn/sidebar';
import { cn } from '@/shared/utils';
import type { RemixiconComponentType } from '@remixicon/react';
import { useLocation } from '@tanstack/react-router';
import type { ReactNode } from 'react';
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
  badge?: number;
  priority?: boolean;
};

type NavProps = {
  isOpen?: boolean;
  items: MenuItem[];
  title: string;
  className?: string;
  action?: ReactNode;
};

export function NavGroup({ items, title, isOpen, className, action }: NavProps) {
  const { pathname } = useLocation();
  const { open } = useSidebar();

  const isSidebarCollapsed = !open;

  return (
    <div
      data-collapsed={isSidebarCollapsed}
      className={cn(
        'group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2',
        className,
      )}
    >
      <div className="flex flex-col gap-1 px-2 group-data-[collapsed=true]:justify-center group-data-[collapsed=true]:px-2">
        <div className="flex items-center justify-between px-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 group-data-[collapsed=true]:hidden">
          <span>{title}</span>
          {action && <div className="ml-auto">{action}</div>}
        </div>
        {items.map((item) =>
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
      </div>
    </div>
  );
}
