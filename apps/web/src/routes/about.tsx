import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';

import { useTRPC } from '../lib/trpc';

export const Route = createFileRoute('/about')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' });
    }
  },
  component: About,
});

function About() {
  const trpc = useTRPC();
  const protectedContent = useQuery(
    trpc.invalidateOnSessionChange.protectedHello.queryOptions(),
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <p>Hello from About!</p>
      <p>Protected data: {protectedContent.data ?? 'Loading ...'}</p>
      <Link className="text-blue-400 underline" to="/">
        Back
      </Link>
    </div>
  );
}
