import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';
import { APP_ROUTES } from './shared/constants';

export const routes = rootRoute('root.tsx', [
  index('index.tsx'),
  layout('(authenticated)', './modules/shell/pages/authenticated-layout.tsx', [
    index('./modules/home/pages/home-page.tsx'),
    // route('/products', './features/product/pages/product-page.tsx'),
    // route(
    //   '/products/$productId',
    //   './features/product/pages/update-product-page.tsx',
    // ),
    // route('/settings', './features/settings/pages/index.tsx'),
    // route(
    //   '/settings/account/profile',
    //   './features/account/pages/account-profile-page.tsx',
    // ),
    route(APP_ROUTES.TOPIC.LIST, './modules/topic/pages/topic-page.tsx'),
    route(APP_ROUTES.TOPIC.DETAIL, './modules/words/pages/word-list-page.tsx'),
  ]),
  layout(
    '(unauthenticated)',
    './modules/shell/pages/unauthenticated-layout.tsx',
    [
      route(APP_ROUTES.AUTH.LOGIN, './modules/auth/pages/login-page.tsx'),
      route(APP_ROUTES.AUTH.REGISTER, './modules/auth/pages/register-page.tsx'),
    ],
  ),
  layout('(onboarding)', './modules/workspace/pages/onboarding-layout.tsx', [
     route(APP_ROUTES.ONBOARDING.WORKSPACE, './modules/workspace/pages/create-workspace-page.tsx'),
  ]),
]);
