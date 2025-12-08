import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import {
  RiBankCardLine,
  RiBarChartBoxLine,
  RiCoinsLine,
  RiCoupon2Line,
  RiDatabase2Line,
  RiDiscountPercentLine,
  RiEqualizerLine,
  RiGiftLine,
  RiGridFill,
  RiHistoryLine,
  RiIdCardLine,
  RiLinksLine,
  RiMailLine,
  RiNodeTree,
  RiPercentLine,
  RiPriceTag3Line,
  RiPrinterLine,
  RiRefreshLine,
  RiRouteLine,
  RiScales2Line,
  RiSettings2Line,
  RiShieldUserLine,
  RiShoppingBag2Line,
  RiSmartphoneLine,
  RiStore2Line,
  RiTimeLine,
  RiTruckLine,
  RiUser6Line,
  RiUserAddLine,
  RiWebhookLine,
} from '@remixicon/react';
import { useLocation } from '@tanstack/react-router';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  PieChart,
  Settings2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useId } from 'react';
import { type MenuItem, NavGroup } from './nav-group';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();

  const { pathname } = useLocation();

  const navMain: MenuItem[] = [
    {
      id: useId(),
      title: t('product.products'),
      icon: RiShoppingBag2Line,
      children: [
        {
          id: useId(),
          title: t('product.products_list'),
          icon: RiShoppingBag2Line,
          url: '/products',
          shortcut: 'p',
        },
        {
          id: useId(),
          title: t('product.product_categories'),
          icon: RiDatabase2Line,
          url: '/products/categories',
        },
        {
          id: useId(),
          title: t('product.product_toppings'),
          icon: RiEqualizerLine,
          url: '/products/toppings',
        },
        {
          id: useId(),
          title: t('product.date_weekly_menu'),
          icon: RiBarChartBoxLine,
          url: '/daily-menus',
        },
      ],
    },
    {
      id: useId(),
      title: 'Models',
      url: '#',
      icon: Bot,
      children: [
        {
          id: useId(),
          title: 'Genesis',
          url: '#',
        },
        {
          id: useId(),
          title: 'Explorer',
          url: '#',
        },
        {
          id: useId(),
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      id: useId(),
      title: 'Documentation',
      url: '#',
      icon: BookOpen,
      children: [
        {
          id: useId(),
          title: 'Introduction',
          url: '#',
        },
        {
          id: useId(),
          title: 'Get Started',
          url: '#',
        },
        {
          id: useId(),
          title: 'Tutorials',
          url: '#',
        },
        {
          id: useId(),
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      id: useId(),
      title: 'Settings',
      url: '#',
      icon: Settings2,
      children: [
        {
          id: useId(),
          title: 'General',
          url: '#',
        },
        {
          id: useId(),
          title: 'Team',
          url: '#',
        },
        {
          id: useId(),
          title: 'Billing',
          url: '#',
        },
        {
          id: useId(),
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ];
  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
      {
        name: 'Evil Corp.',
        logo: Command,
        plan: 'Free',
      },
    ],

    projects: [
      {
        name: 'Design Engineering',
        url: '#',
        icon: Frame,
      },
      {
        name: 'Sales & Marketing',
        url: '#',
        icon: PieChart,
      },
      {
        name: 'Travel',
        url: '#',
        icon: Map,
      },
    ],
  };

  const navOthers: MenuItem[] = [
    {
      id: useId(),
      title: t('setting.integration'),
      icon: RiEqualizerLine,
      url: '/integrations',
    },
    {
      id: useId(),
      title: t('setting.establish'),
      icon: RiSettings2Line,
      url: '/settings',
      groups: [
        {
          id: useId(),
          title: t('setting.general'),
          items: [
            {
              id: useId(),
              title: t('setting.profile_settings'),
              url: '/settings/account/profile',
              icon: RiUser6Line,
            },
            {
              id: useId(),
              title: t('setting.store_setting'),
              url: '/settings/shop',
              icon: RiStore2Line,
              permissionKey: 'basic_information',
            },
            {
              id: useId(),
              title: t('setting.set_up_roles'),
              icon: RiShieldUserLine,
              url: '/settings/roles',
              permissionKey: 'view_user_role_list',
            },
            {
              id: useId(),
              title: t('setting.add_role'),
              icon: RiUserAddLine,
              url: '/settings/roles/create',
              permissionKey: 'add_edit_user_role',
              isHidden: true,
            },
            {
              id: useId(),
              title: t('setting.store_working_hours'),
              url: '/settings/shop-working-hour',
              icon: RiTimeLine,
              permissionKey: 'view_working_hours_list',
            },
            {
              id: useId(),
              title: t('setting.sms_zns_management'),
              url: '/settings/sms-email',
              icon: RiMailLine,
              permissionKey: 'view_transaction_history',
            },
          ],
        },
        {
          id: useId(),
          title: t('setting.sale'),
          items: [
            // {
            //     title: t('setting.price_list'),
            //     icon: RiQuestionMark,
            //     url: '/settings/v1/commission',
            // },
            {
              id: useId(),
              title: t('setting.price_list'),
              icon: RiPriceTag3Line,
              url: '/settings/price-lists',
              permissionKey: 'pricing_policy',
            },
            {
              id: useId(),
              title: t('setting.payment_methods'),
              icon: RiBankCardLine,
              url: '/settings/payment-methods',
              permissionKey: 'view_cash_fund_list',
            },
            {
              id: useId(),
              title: t('setting.tax_settings'),
              url: '/settings/tax',
              icon: RiPercentLine,
              permissionKey: 'tax_setup',
            },
            {
              id: useId(),
              title: t('setting.order_status'),
              url: '/settings/order-status',
              icon: RiRouteLine,
              permissionKey: 'order_status',
            },
            {
              id: useId(),
              title: t('setting.set_up_print_templates'),
              url: '/settings/print-template',
              icon: RiPrinterLine,
              permissionKey: 'print_template_setup',
            },
            {
              id: useId(),
              title: t('setting.shipping_configuration'),
              url: '/settings/shipping',
              icon: RiTruckLine,
              permissionKey: 'shipping_configuration',
            },
            {
              id: useId(),
              title: t('setting.electronic_scales'),
              icon: RiScales2Line,
              url: '/settings/electronic-scales',
              permissionKey: 'electronic_scale',
            },
          ],
        },
        {
          id: useId(),
          title: t('setting.loyalty'),
          items: [
            {
              id: useId(),
              title: t('setting.promotions'),
              url: '/settings/marketing',
              icon: RiDiscountPercentLine,
            },
            {
              id: useId(),
              title: t('setting.vouchers'),
              url: '/settings/vouchers',
              icon: RiCoupon2Line,
            },
            {
              id: useId(),
              title: t('setting.membership_tiers'),
              url: '/settings/membership-terms',
              icon: RiIdCardLine,
            },
            {
              id: useId(),
              title: t('setting.point_accumulation'),
              url: '/settings/accumulate-points',
              icon: RiCoinsLine,
            },
            {
              id: useId(),
              title: t('setting.gift_exchange'),
              url: '/settings/exchange-gifts',
              icon: RiGiftLine,
            },
          ],
        },
        {
          id: useId(),
          title: t('setting.other'),
          items: [
            {
              id: useId(),
              title: t('setting.table_settings'),
              url: '/settings/table',
              icon: RiGridFill,
            },
            {
              id: useId(),
              title: t('setting.data_sync_request'),
              url: '/settings/request-data-sync',
              icon: RiRefreshLine,
            },
          ],
        },
        {
          id: useId(),
          title: t('setting.advanced_settings'),
          items: [
            {
              id: useId(),
              title: t('setting.branch_groups'),
              url: '/settings/branch-groups',
              icon: RiNodeTree,
            },
            {
              id: useId(),
              title: t('setting.branch_list'),
              url: '/settings/branches',
              icon: RiStore2Line,
            },
            {
              id: useId(),
              title: t('setting.operation_history'),
              url: '/settings/activities',
              icon: RiHistoryLine,
            },
            {
              id: useId(),
              title: t('setting.device_management'),
              url: '/settings/devices',
              icon: RiSmartphoneLine,
            },
            {
              id: useId(),
              title: t('setting.webhooks'),
              url: '/settings/webhooks',
              icon: RiWebhookLine,
              permissionKey: 'basic_information',
            },
            {
              id: useId(),
              title: t('setting.add_webhook'),
              url: '/settings/webhooks/create',
              permissionKey: 'basic_information',
              isHidden: true,
            },
            {
              id: useId(),
              title: t('setting.api_keys'),
              url: '/settings/api-keys',
              icon: RiLinksLine,
              permissionKey: 'basic_information',
            },
            {
              id: useId(),
              title: t('setting.add_api_key'),
              url: '/settings/api-keys/create',
              permissionKey: 'basic_information',
              isHidden: true,
            },
          ],
        },
      ],
      isHideChildren: true,
      isShowSubSidebar: true,
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <Separator orientation="horizontal" />
      <SidebarContent>
        <NavGroup title={t('sidebar.main')} items={navMain} />
        <NavGroup title={t('sidebar.other')} items={navOthers} />
      </SidebarContent>
      <Separator orientation="horizontal" />
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
