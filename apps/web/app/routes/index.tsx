import { useTRPC } from '@/trpc';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

import { Button } from '@where-are-my-games/ui-web/ui/button.tsx';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => await context.trpc.hello.query(),
});

function Home() {
  const trpc = useTRPC();
  const useHello = useQuery(trpc.hello.queryOptions());

  const state = Route.useLoaderData();
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <p>Works!</p>
      <p>{state}</p>
      {useHello.isSuccess && <p>On client: {useHello.data}</p>}
      <Button variant="default">This is a button</Button>
    </div>
  );
}
