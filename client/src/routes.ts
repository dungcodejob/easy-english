import { index, layout, rootRoute, route } from '@tanstack/virtual-file-routes';

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
    route('/topic', './modules/topic/pages/topic-page.tsx'),
  ]),
  layout(
    '(unauthenticated)',
    './modules/shell/pages/unauthenticated-layout.tsx',
    [route('/login', './modules/auth/pages/login-page.tsx')],
  ),
]);
