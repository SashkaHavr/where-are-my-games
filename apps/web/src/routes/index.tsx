import { authClient, useSession } from '@/lib/auth';
import { useTRPC } from '@/lib/trpc';
import { trpcMiddleware } from '@/lib/trpcMiddlewareServerFn';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

import { Button } from '@where-are-my-games/ui-web/ui/button.tsx';

const hello = createServerFn()
  .middleware([trpcMiddleware])
  .handler(({ context }) => context.trpc.hello());

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => hello(),
});

function Home() {
  const trpc = useTRPC();
  const session = useSession();
  const useHello = useQuery(trpc.hello.queryOptions());
  const useIsAuthorised = useQuery(
    trpc.invalidateOnSessionChange.isAuthorised.queryOptions(),
  );
  const useProtectedHello = useQuery(
    trpc.invalidateOnSessionChange.protectedHello.queryOptions(),
  );
  const queryClient = useQueryClient();

  // const data = Route.useLoaderData();
  return (
    <div className="gap-2 flex w-full flex-col items-center justify-center">
      <p>Works!</p>
      {/* <p>{data.hello}</p> */}
      {useHello.isSuccess && <p>On client: {useHello.data}</p>}
      <Button variant="default">This is a button</Button>
      {!session.data ? (
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
          }}
        >
          Sign out
        </Button>
      )}
      <p>User email: {session.data?.user.email ?? 'Not logged in'}</p>

      {useIsAuthorised.isSuccess && (
        <p>
          Is authorised from server: {useIsAuthorised.data ? 'True' : 'False'}
        </p>
      )}
      {useProtectedHello.isSuccess && <p>{useProtectedHello.data}</p>}
      <Link className="text-blue-500 underline" to="/protected">
        Link to protected route
      </Link>
    </div>
  );
}
