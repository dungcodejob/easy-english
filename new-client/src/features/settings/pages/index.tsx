import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_(authenticated)/settings')({
  // loader: () => {
  //   throw redirect({
  //     to: '/settings/account/profile',
  //   });
  // },
  component: SettingPage,
});

function SettingPage() {
  return <div>Hello "/(authenticated)/(main)/settings"!</div>;
}
