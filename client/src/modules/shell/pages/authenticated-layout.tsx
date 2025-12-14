import { SidebarProvider } from '@/shared/ui/shadcn/sidebar';
import { useAuthStore } from '@auth/stores';
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
import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
} from '@tanstack/react-router';
import { BookOpen, Bot, Settings2 } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSidebar } from '../features/app-sidebar';
import { SiteHeader } from '../features/header';
import SubSidebarMenu from '../features/sub-sidebar-menu';
import type { MenuGroup, MenuItem } from '../ui/nav-group';

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
        to: '/login',
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

  const groups = useMemo(
    () =>
      [
        {
          id: uuid(),

          title: t('sidebar.main'),
          items: [
            {
              id: uuid(),
              title: t('product.products'),
              icon: RiShoppingBag2Line,
              children: [
                {
                  id: uuid(),
                  title: t('product.products_list'),
                  icon: RiShoppingBag2Line,
                  url: '/products',
                  shortcut: 'p',
                },
                {
                  id: uuid(),
                  title: t('product.product_categories'),
                  icon: RiDatabase2Line,
                  url: '/products/categories',
                },
                {
                  id: uuid(),
                  title: t('product.product_toppings'),
                  icon: RiEqualizerLine,
                  url: '/products/toppings',
                },
                {
                  id: uuid(),
                  title: t('product.date_weekly_menu'),
                  icon: RiBarChartBoxLine,
                  url: '/daily-menus',
                },
              ],
            },
            {
              id: uuid(),
              title: 'Models',
              url: '#',
              icon: Bot,
              children: [
                {
                  id: uuid(),
                  title: 'Genesis',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Explorer',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Quantum',
                  url: '#',
                },
              ],
            },
            {
              id: uuid(),
              title: 'Documentation',
              url: '#',
              icon: BookOpen,
              children: [
                {
                  id: uuid(),
                  title: 'Introduction',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Get Started',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Tutorials',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Changelog',
                  url: '#',
                },
              ],
            },
            {
              id: uuid(),
              title: 'Settings',
              url: '#',
              icon: Settings2,
              children: [
                {
                  id: uuid(),
                  title: 'General',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Team',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Billing',
                  url: '#',
                },
                {
                  id: uuid(),
                  title: 'Limits',
                  url: '#',
                },
              ],
            },
          ],
        },
        {
          id: uuid(),
          title: t('sidebar.other'),
          items: [
            {
              id: uuid(),
              title: t('setting.integration'),
              icon: RiEqualizerLine,
              url: '/integrations',
            },
            {
              id: uuid(),
              title: t('setting.establish'),
              icon: RiSettings2Line,
              url: '/settings',
              groups: [
                {
                  id: uuid(),
                  title: t('setting.general'),
                  items: [
                    {
                      id: uuid(),
                      title: t('setting.profile_settings'),
                      url: '/settings/account/profile',
                      icon: RiUser6Line,
                    },
                    {
                      id: uuid(),
                      title: t('setting.store_setting'),
                      url: '/settings/shop',
                      icon: RiStore2Line,
                      permissionKey: 'basic_information',
                    },
                    {
                      id: uuid(),
                      title: t('setting.set_up_roles'),
                      icon: RiShieldUserLine,
                      url: '/settings/roles',
                      permissionKey: 'view_user_role_list',
                    },
                    {
                      id: uuid(),
                      title: t('setting.add_role'),
                      icon: RiUserAddLine,
                      url: '/settings/roles/create',
                      permissionKey: 'add_edit_user_role',
                      isHidden: true,
                    },
                    {
                      id: uuid(),
                      title: t('setting.store_working_hours'),
                      url: '/settings/shop-working-hour',
                      icon: RiTimeLine,
                      permissionKey: 'view_working_hours_list',
                    },
                    {
                      id: uuid(),
                      title: t('setting.sms_zns_management'),
                      url: '/settings/sms-email',
                      icon: RiMailLine,
                      permissionKey: 'view_transaction_history',
                    },
                  ],
                },
                {
                  id: uuid(),
                  title: t('setting.sale'),
                  items: [
                    // {
                    //     title: t('setting.price_list'),
                    //     icon: RiQuestionMark,
                    //     url: '/settings/v1/commission',
                    // },
                    {
                      id: uuid(),
                      title: t('setting.price_list'),
                      icon: RiPriceTag3Line,
                      url: '/settings/price-lists',
                      permissionKey: 'pricing_policy',
                    },
                    {
                      id: uuid(),
                      title: t('setting.payment_methods'),
                      icon: RiBankCardLine,
                      url: '/settings/payment-methods',
                      permissionKey: 'view_cash_fund_list',
                    },
                    {
                      id: uuid(),
                      title: t('setting.tax_settings'),
                      url: '/settings/tax',
                      icon: RiPercentLine,
                      permissionKey: 'tax_setup',
                    },
                    {
                      id: uuid(),
                      title: t('setting.order_status'),
                      url: '/settings/order-status',
                      icon: RiRouteLine,
                      permissionKey: 'order_status',
                    },
                    {
                      id: uuid(),
                      title: t('setting.set_up_print_templates'),
                      url: '/settings/print-template',
                      icon: RiPrinterLine,
                      permissionKey: 'print_template_setup',
                    },
                    {
                      id: uuid(),
                      title: t('setting.shipping_configuration'),
                      url: '/settings/shipping',
                      icon: RiTruckLine,
                      permissionKey: 'shipping_configuration',
                    },
                    {
                      id: uuid(),
                      title: t('setting.electronic_scales'),
                      icon: RiScales2Line,
                      url: '/settings/electronic-scales',
                      permissionKey: 'electronic_scale',
                    },
                  ],
                },
                {
                  id: uuid(),
                  title: t('setting.loyalty'),
                  items: [
                    {
                      id: uuid(),
                      title: t('setting.promotions'),
                      url: '/settings/marketing',
                      icon: RiDiscountPercentLine,
                    },
                    {
                      id: uuid(),
                      title: t('setting.vouchers'),
                      url: '/settings/vouchers',
                      icon: RiCoupon2Line,
                    },
                    {
                      id: uuid(),
                      title: t('setting.membership_tiers'),
                      url: '/settings/membership-terms',
                      icon: RiIdCardLine,
                    },
                    {
                      id: uuid(),
                      title: t('setting.point_accumulation'),
                      url: '/settings/accumulate-points',
                      icon: RiCoinsLine,
                    },
                    {
                      id: uuid(),
                      title: t('setting.gift_exchange'),
                      url: '/settings/exchange-gifts',
                      icon: RiGiftLine,
                    },
                  ],
                },
                {
                  id: uuid(),
                  title: t('setting.other'),
                  items: [
                    {
                      id: uuid(),
                      title: t('setting.table_settings'),
                      url: '/settings/table',
                      icon: RiGridFill,
                    },
                    {
                      id: uuid(),
                      title: t('setting.data_sync_request'),
                      url: '/settings/request-data-sync',
                      icon: RiRefreshLine,
                    },
                  ],
                },
                {
                  id: uuid(),
                  title: t('setting.advanced_settings'),
                  items: [
                    {
                      id: uuid(),
                      title: t('setting.branch_groups'),
                      url: '/settings/branch-groups',
                      icon: RiNodeTree,
                    },
                    {
                      id: uuid(),
                      title: t('setting.branch_list'),
                      url: '/settings/branches',
                      icon: RiStore2Line,
                    },
                    {
                      id: uuid(),
                      title: t('setting.operation_history'),
                      url: '/settings/activities',
                      icon: RiHistoryLine,
                    },
                    {
                      id: uuid(),
                      title: t('setting.device_management'),
                      url: '/settings/devices',
                      icon: RiSmartphoneLine,
                    },
                    {
                      id: uuid(),
                      title: t('setting.webhooks'),
                      url: '/settings/webhooks',
                      icon: RiWebhookLine,
                      permissionKey: 'basic_information',
                    },
                    {
                      id: uuid(),
                      title: t('setting.add_webhook'),
                      url: '/settings/webhooks/crete',
                      permissionKey: 'basic_information',
                      isHidden: true,
                    },
                    {
                      id: uuid(),
                      title: t('setting.api_keys'),
                      url: '/settings/api-keys',
                      icon: RiLinksLine,
                      permissionKey: 'basic_information',
                    },
                    {
                      id: uuid(),
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
          ],
        },
      ] as MenuGroup[],
    [t],
  );

  const activeItem = useMemo(() => {
    const current = findCurrentMenuItem(
      groups.map((item) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        children: item.items,
      })),
      pathname,
    );
    if (!current || current.children?.length) {
      return null;
    }

    return current;
  }, [groups, pathname]);

  return (
    <SidebarProvider>
      <AppSidebar />

      <div className="flex h-full">
        {activeItem?.groups ? (
          <SubSidebarMenu title={activeItem.title} groups={activeItem.groups} />
        ) : (
          <div className="w-0" />
        )}

        <div className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SiteHeader />
          </header>

          <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-1 flex-col self-stretch">
            <Outlet />
          </div>
        </div>
      </div>

      {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <SiteHeader />
        </header>
        <div className="relative z-50 mx-auto flex w-full max-w-[1360px] flex-1 flex-col self-stretch">
          <Outlet />
        </div> */}
    </SidebarProvider>
  );
}
