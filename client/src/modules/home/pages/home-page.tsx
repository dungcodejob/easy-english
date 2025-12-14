import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_(authenticated)/')({
  component: HomePage,
});

export function HomePage() {
  return <div>home</div>;
}
