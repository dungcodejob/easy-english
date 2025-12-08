import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute(
  '/_(authenticated)/settings/account/profile',
)({
  component: AccountProfilePage,
});

function AccountProfilePage() {
  return <div>Hello "/(authenticated)/(main)/settings/account-settings"!</div>;
}
