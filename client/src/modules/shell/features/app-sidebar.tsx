import { WorkspaceSwitcher } from '@/modules/workspace/components/workspace-switcher';
import { useWorkspaceStore } from '@/modules/workspace/stores/workspace.store';
import { Separator } from '@shared/ui/shadcn/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@shared/ui/shadcn/sidebar';
import {
  Flame,
  FolderOpen,
  GraduationCap,
  Plus,
  Settings,
  TrendingUp,
  Trophy
} from 'lucide-react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { NavGroup, type MenuItem } from '../ui/nav-group';
import { NavUser } from '../ui/nav-user';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { currentWorkspaceId } = useWorkspaceStore();

  // Mock data for user - this should come from auth store
  const user = {
    name: 'User',
    email: 'user@example.com',
    avatar: '',
  };

  // Priority Section - Visually Emphasized
  const navPriority: MenuItem[] = [
    {
      id: useId(),
      title: t('sidebar.today_review'),
      url: '/review',
      icon: Flame, // 🔥 fire icon
      badge: 3, // pending review count (mock data)
      priority: true, // special styling flag
    },
  ];

  // Learning Actions - Primary Tasks
  const navLearning: MenuItem[] = [
    {
        id: useId(),
        title: t('sidebar.learn'),
        url: '/learn',
        icon: GraduationCap,
    },
    {
        id: useId(),
        title: t('sidebar.topics'),
        url: '/topic',
        icon: FolderOpen,
    },
    {
        id: useId(),
        title: t('sidebar.add_word'),
        url: '/word', // will trigger dialog in future
        icon: Plus,
    },
  ];

  // Progress Tracking - Secondary Information
  const navProgress: MenuItem[] = [
    {
        id: useId(),
        title: t('sidebar.progress'),
        url: '/progress',
        icon: TrendingUp,
    },
    {
        id: useId(),
        title: t('sidebar.achievements'),
        url: '/achievements',
        icon: Trophy,
    },
  ];

  // System Actions - Tertiary
  const navSystem: MenuItem[] = [
    {
        id: useId(),
        title: t('sidebar.settings'),
        url: '/settings',
        icon: Settings,
    },
  ];

  if (!currentWorkspaceId) {
    return null; // Or render loading state/redirect
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <Separator orientation="horizontal" />
      <SidebarContent>
        <NavGroup title={t('sidebar.priority')} items={navPriority} />
        <NavGroup title={t('sidebar.learning')} items={navLearning} />
        <NavGroup title={t('sidebar.progress')} items={navProgress} />
        <div className="mt-auto">
            <NavGroup title={t('sidebar.system')} items={navSystem} />
        </div>
      </SidebarContent>
      <Separator orientation="horizontal" />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
