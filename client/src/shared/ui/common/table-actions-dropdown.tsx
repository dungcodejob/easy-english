import { type RemixiconComponentType, RiMore2Line } from '@remixicon/react';
import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Button } from '../shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../shadcn/dropdown-menu';

export type Action = {
  id: string;
  onClick?: () => void;
} & (
  | {
      icon: ComponentType<SVGProps<SVGSVGElement>> | RemixiconComponentType;
      label: string;
      component?: undefined;
    }
  | {
      component: ReactNode;
      icon?: undefined;
      label?: undefined;
    }
);

export interface TableActionsDropdownProps {
  actions: Action[];
}

export function TableActionsDropdown({ actions }: TableActionsDropdownProps) {
  return (
    <div className="flex justify-center">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="outline-none focus:outline-none">
            <RiMore2Line />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          sideOffset={4}
          align="end"
          className="min-w-56 rounded-lg"
        >
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              onClick={action.onClick}
              asChild={Boolean(action.component)}
            >
              {action.component || (
                <>
                  {action.icon && <action.icon />}
                  {action.label}
                </>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
