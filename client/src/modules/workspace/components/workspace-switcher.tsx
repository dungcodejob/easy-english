import { APP_ROUTES } from '@/shared/constants';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/shared/ui/shadcn/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shared/ui/shadcn/sidebar';
import { useNavigate } from '@tanstack/react-router';
import CN from 'country-flag-icons/react/3x2/CN';
import DE from 'country-flag-icons/react/3x2/DE';
import ES from 'country-flag-icons/react/3x2/ES';
import FR from 'country-flag-icons/react/3x2/FR';
import GB from 'country-flag-icons/react/3x2/GB';
import JP from 'country-flag-icons/react/3x2/JP';
import KR from 'country-flag-icons/react/3x2/KR';
import VN from 'country-flag-icons/react/3x2/VN';
import { ChevronsUpDown, Plus } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useWorkspaceStore } from '../stores/workspace.store';
import { Language } from '../types/workspace.types';

const LANGUAGE_FLAGS: Record<Language, React.ElementType> = {
  [Language.EN]: GB,
  [Language.VI]: VN,
  [Language.ES]: ES,
  [Language.FR]: FR,
  [Language.DE]: DE,
  [Language.JA]: JP,
  [Language.KO]: KR,
  [Language.ZH]: CN,
};

const LANGUAGE_NAMES: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.VI]: 'Tiếng Việt',
  [Language.ES]: 'Español',
  [Language.FR]: 'Français',
  [Language.DE]: 'Deutsch',
  [Language.JA]: '日本語',
  [Language.KO]: '한국어',
  [Language.ZH]: '中文',
};

export function WorkspaceSwitcher() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useSidebar();
  const { workspaces, currentWorkspaceId, setCurrentWorkspaceId } = useWorkspaceStore();
  
  const currentWorkspace = workspaces.find(w => w.id === currentWorkspaceId);
  const CurrentFlag = currentWorkspace ? LANGUAGE_FLAGS[currentWorkspace.language] : null;

  const handleSwitchWorkspace = (workspaceId: string) => {
    setCurrentWorkspaceId(workspaceId);
    // Optional: reload or navigate to root to ensure fresh state
    navigate({ to: APP_ROUTES.ROOT });
  };

  const handleCreateWorkspace = () => {
    navigate({ to: '/onboarding/workspace' });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground">
                {CurrentFlag ? <CurrentFlag className="w-5 h-5 rounded-sm" /> : '🌐'}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentWorkspace ? currentWorkspace.name : t('workspace.no_workspaces')}
                </span>
                <span className="truncate text-xs">
                 {currentWorkspace ? LANGUAGE_NAMES[currentWorkspace.language] : ''}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t('workspace.switch')}
            </DropdownMenuLabel>
            
            <DropdownMenuGroup>
              {workspaces.map((workspace) => {
                 const Flag = LANGUAGE_FLAGS[workspace.language];
                 return (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Flag className="w-4 h-4 rounded-[2px]" />
                  </div>
                  {workspace.name}
                  {workspace.id === currentWorkspaceId && (
                     <span className="ml-auto text-xs text-muted-foreground">Active</span>
                  )}
                </DropdownMenuItem>
              )})}
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleCreateWorkspace} className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">{t('sidebar.create_workspace')}</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
