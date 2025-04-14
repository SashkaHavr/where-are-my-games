import { authClient, useSession } from '@/lib/auth';
import { getSession } from '@/lib/isAuthenticatedServerFn';
import { useTRPC } from '@/lib/trpc';
import { trpcMiddleware } from '@/lib/trpcMiddlewareServerFn';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { Button } from '@where-are-my-games/ui/button.tsx';

const hello = createServerFn()
  .middleware([trpcMiddleware])
  .handler(({ context }) => context.trpc.hello());

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => ({ hello: hello(), session: await getSession() }),
});

function Home() {
  const trpc = useTRPC();
  const router = useRouter();
  const session = useSession();
  const useHello = useQuery(trpc.hello.queryOptions());
  const queryClient = useQueryClient();
  const loaderData = Route.useLoaderData();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <p>Works!</p>
      <p>Data from loader: {loaderData.hello}</p>
      <p>Data from client: {useHello.isSuccess ? useHello.data : ''}</p>
      <Button variant="default">This is a button</Button>
      {!loaderData.session ? (
        <Button
          variant="default"
          onClick={() => {
            void authClient.signIn.social({ provider: 'github' });
          }}
        >
          Sign in GitHub
        </Button>
      ) : (
        <Button
          variant="default"
          onClick={() => {
            void authClient.signOut();
            void queryClient.invalidateQueries(
              trpc.invalidateOnSessionChange.pathFilter(),
            );
            void router.invalidate();
          }}
        >
          Sign out
        </Button>
      )}
      <p>
        User email from server:{' '}
        {loaderData.session?.user.email ?? 'Not logged in'}
      </p>
      <p>
        User email from client: {session.data?.user.email ?? 'Not logged in'}
      </p>

      <Link className="text-blue-500 underline" to="/protected">
        Link to protected route
      </Link>
      <Link className="text-blue-500 underline" to="/authorized">
        Link to authorized route
      </Link>
    </div>
  );
}
