import { index, rootRoute } from '@tanstack/virtual-file-routes';

export const routes = rootRoute('root.tsx', [
  index('index.tsx'),
  // layout('(authenticated)', './features/shell/pages/authenticated-layout.tsx', [
  //   index('./features/home/pages/home.tsx'),
  //   route('/products', './features/product/pages/product-page.tsx'),
  //   route(
  //     '/products/$productId',
  //     './features/product/pages/update-product-page.tsx',
  //   ),
  //   route('/settings', './features/settings/pages/index.tsx'),
  //   route(
  //     '/settings/account/profile',
  //     './features/account/pages/account-profile-page.tsx',
  //   ),
  // ]),
  // layout(
  //   '(unauthenticated)',
  //   './features/shell/pages/unauthenticated-layout.tsx',
  //   [route('/login', './features/auth/pages/login-page.tsx')],
  // ),
]);
