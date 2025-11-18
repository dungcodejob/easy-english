'use client';
import { ChevronDown } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { DropdownMenuArrow } from '@radix-ui/react-dropdown-menu';
import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import type { MenuItem } from './nav-group';
import { NavItem } from './nav-item';

type NavProps = {
  isCollapsed?: boolean;
  isOpen?: boolean;
  item: MenuItem;
};

export function NavItemCollapse({
  item,
  isCollapsed,
  isOpen: isOpenDefault = false,
}: NavProps) {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  if (isCollapsed) {
    return (
      <DropdownMenu>
        <TooltipProvider disableHoverableContent>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="justify-start mb-1 p-2 w-fit h-fit dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                >
                  <div className="items-center flex justify-between">
                    <div className="flex items-center ">
                      <span className={cn(isOpen === false ? '' : 'mr-4')}>
                        {item.icon && <item.icon />}
                      </span>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" alignOffset={2}>
              {item.title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent side="right" sideOffset={25} align="start">
          <DropdownMenuLabel className="max-w-[190px] truncate">
            {item.title}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="flex flex-col">
            {item.children?.map((item) => {
              const isActive =
                !!item.url && !item.groups && pathname.includes(item.url);
              return (
                <DropdownMenuItem key={item.id} asChild>
                  <Link
                    to={item.url}
                    className={cn(
                      buttonVariants({
                        variant: isActive ? 'outline' : 'ghost',
                        size: 'sm',
                      }),
                      'h-9 px-2',

                      'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
                      'justify-start',
                    )}
                  >
                    {item.icon && <item.icon className="!w-5 !h-5" />}
                    {item.title}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </div>
          <DropdownMenuArrow className="fill-border" />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger
        className="[&[data-state=open]>div>div>svg]:rotate-180 mb-1"
        asChild
      >
        <Link
          to="/"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'h-9 w-full px-2',

            'dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white',
            'justify-between',
          )}
        >
          <div className="flex gap-2 dark:text-muted-foreground dark:hover:text-white">
            {item.icon && <item.icon className="!w-5 !h-5" />}
            {item.title}
          </div>
          <div
            className={cn(
              'whitespace-nowrap translate-x-0 opacity-100 transition-transform duration-300 ease-in-out',

              !isCollapsed
                ? 'translate-x-0 opacity-100'
                : '-translate-x-96 opacity-0',
              isOpen && 'rotate-180',
            )}
          >
            <ChevronDown size={18} />
          </div>
        </Link>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        <div className="grid gap-1 pl-7 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          {item.children?.map((item) => {
            const isActive =
              !!item.url && !item.groups && pathname.includes(item.url);
            return (
              <NavItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                isActive={isActive}
              />
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  // return (
  //     <div
  //         data-collapsed={isCollapsed}
  //         className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
  //     >
  //         <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
  //             {items.map((item, index) =>
  //                 isCollapsed ? (
  //                     <Tooltip key={index} delayDuration={0}>
  //                         <TooltipTrigger asChild>
  //                             <Link
  //                                 to="/"
  //                                 className={cn(
  //                                     buttonVariants({ variant: 'outline', size: "icon" }),
  //                                     "h-9 w-9",
  //                                     isActive &&
  //                                     "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
  //                                 )}
  //                             >
  //                                 {item.icon && <item.icon className="!w-5 !h-5" />}
  //                                 <span className="sr-only">{item.title}</span>
  //                             </Link>
  //                         </TooltipTrigger>
  //                         <TooltipContent side="right" className="flex items-center gap-4">
  //                             {item.title}

  //                         </TooltipContent>
  //                     </Tooltip>
  //                 ) : (
  //                     <Link
  //                         key={index}
  //                         to="/"
  //                         className={cn(
  //                             buttonVariants({ variant: 'outline', size: "sm" }),
  //                             "h-9",
  //                             isActive &&
  //                             "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
  //                             "justify-start"
  //                         )}
  //                     >
  //                         {item.icon && <item.icon className="!w-5 !h-5" />}
  //                         {item.title}
  //                         <div
  //                             className={cn(
  //                                 "whitespace-nowrap translate-x-0 opacity-100",
  //                                 isOpen
  //                                     ? "translate-x-0 opacity-100"
  //                                     : "-translate-x-96 opacity-0"
  //                             )}
  //                         >
  //                             <ChevronDown
  //                                 size={18}
  //                                 className="transition-transform duration-200"
  //                             />
  //                         </div>
  //                     </Link>
  //                 )
  //             )}
  //         </nav>
  //     </div>
  // )
}
