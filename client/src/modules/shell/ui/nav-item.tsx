'use client';

import { buttonVariants } from '@/shared/ui/shadcn/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/shared/ui/shadcn/tooltip';
import { cn } from '@/shared/utils';
import { Link } from '@tanstack/react-router';
import { NavBadge } from './nav-badge';
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
              item.priority && 'bg-primary/10 text-primary hover:bg-primary/20'
            )}
          >
            {item.icon && <item.icon />}
            <span className="sr-only">{item.title}</span>
            {item.badge && (
               <div className="absolute top-0 right-0 size-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {item.title}
          {item.badge && (
             <span className="ml-auto text-muted-foreground">{item.badge}</span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Link
      to={item.url}
      className={cn(
        buttonVariants({ 
            variant: isActive ? 'outline' : 'ghost', 
            size: 'sm' 
        }),
        'h-9 px-2 relative',
        'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
        'justify-start',
        item.priority && 'bg-linear-to-r from-orange-500/10 to-red-500/10 hover:from-orange-500/20 hover:to-red-500/20 border border-orange-200/20'
      )}
    >
      {item.icon && (
        <item.icon 
            className={cn(
                "w-5! h-5! mr-2",
                item.priority && "text-orange-500"
            )} 
        />
      )}
      <span className={cn(item.priority && "font-semibold")}>
          {item.title}
      </span>
      
      {item.badge && (
        <NavBadge count={item.badge} variant={item.priority ? 'destructive' : 'default'} />
      )}
    </Link>
  );
}
