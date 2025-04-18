import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';

import { Button } from '@where-are-my-games/ui/button.js';

import { authClient } from '../lib/auth';
import { useTRPC } from '../lib/trpc';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const session = Route.useRouteContext().session;
  const trpc = useTRPC();
  const useHello = useQuery(trpc.hello.queryOptions());
  const queryClient = useQueryClient();
  const router = useRouter();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <p>Works!</p>
      <p>Data from client: {useHello.isSuccess ? useHello.data : ''}</p>
      {!session ? (
        <Button
          variant="default"
          onClick={() => {
            void authClient.signIn.social({
              provider: 'github',
              callbackURL: window.location.href,
            });
          }}
        >
          Sign in GitHub
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={() => {
            void authClient.signOut().then(() => {
              void queryClient.invalidateQueries(
                trpc.invalidateOnSessionChange.pathFilter(),
              );
              void router.invalidate();
            });
          }}
        >
          Sign out
        </Button>
      )}
      <p>User email: {session?.user.email ?? 'Not logged in'}</p>
      <Link className="text-blue-500 underline" to="/about">
        Link to protected route
      </Link>
    </div>
  );
}
