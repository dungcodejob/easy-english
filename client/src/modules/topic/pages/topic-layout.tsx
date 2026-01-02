import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_(authenticated)/_/topic')({
  component: TopicLayout,
});

export function TopicLayout() {
  return <Outlet />;
}
