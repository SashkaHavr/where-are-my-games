import { signIn, signOut, useSession } from '@/auth';
import { useTRPC } from '@/trpc';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@where-are-my-games/ui-web/ui/button.tsx';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => ({
    hello: await context.trpc.hello.query(),
  }),
});

function Home() {
  const trpc = useTRPC();
  const session = useSession();
  const useHello = useQuery(trpc.hello.queryOptions());

  const data = Route.useLoaderData();
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <p>Works!</p>
      <p>{data.hello}</p>
      {useHello.isSuccess && <p>On client: {useHello.data}</p>}
      <Button variant="default">This is a button</Button>
      <Button
        variant="default"
        onClick={() => void signIn.social({ provider: 'github' })}
      >
        Sign in GitHub
      </Button>
      <p>User email: {session.data?.user.email ?? 'Not logged in'}</p>
      <Button variant="default" onClick={() => void signOut()}>
        Sign out
      </Button>
    </div>
  );
}
