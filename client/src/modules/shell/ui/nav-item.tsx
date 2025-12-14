'use client';

import { buttonVariants } from '@/shared/ui/shadcn/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/ui/shadcn/tooltip';
import { cn } from '@/shared/utils';
import { Link } from '@tanstack/react-router';
import type { MenuItem } from './nav-group';

type NavProps = {
  isCollapsed?: boolean;
  item: MenuItem;
  isActive?: boolean;
};

export function NavItem({ item, isCollapsed, isActive }: NavProps) {
  if (isCollapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            to={item.url}
            className={cn(
              buttonVariants({
                variant: isActive ? 'outline' : 'ghost',
                size: 'icon',
              }),

              'w-fit h-fit p-2 mb-1',
              'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
            )}
          >
            {item.icon && <item.icon />}
            <span className="sr-only">{item.title}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      to={item.url}
      className={cn(
        buttonVariants({ variant: isActive ? 'outline' : 'ghost', size: 'sm' }),
        'h-9 px-2',

        'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
        'justify-start',
      )}
    >
      {item.icon && <item.icon className="w-5! h-5!" />}
      {item.title}
    </Link>
  );
}
