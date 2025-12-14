import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_(authenticated)/topic')({
  component: TopicPage,
});

export function TopicPage() {
  return <div>Topic</div>;
}
