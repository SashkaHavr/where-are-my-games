import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { optimisticUpdate } from '@where-are-my-games/utils';
import { Separator } from '~/components/ui/separator';

import { DesktopNav } from '~/components/app/DesktopNav';
import { GameCard } from '~/components/app/GameCard';
import { Search } from '~/components/app/Search';
import { TypingAnimation } from '~/components/landing/TypingAnimation';
import { trpc } from '~/lib/trpc';

export const Route = createFileRoute('/app')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' });
    }
    return {
      user: context.session.user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const user = Route.useRouteContext().user;

  const games = useQuery(trpc.games.getAll.queryOptions());

  const addGameMutation = useMutation(
    trpc.games.add.mutationOptions(
      optimisticUpdate(
        queryClient,
        trpc.games.getAll.queryKey(),
        (old, input) => (old ? [...old, input.game] : [input.game]),
      ),
    ),
  );

  return (
    <div className="flex h-svh w-full">
      <DesktopNav user={user} className="shrink-0" />
      <Separator orientation="vertical" />
      <div className="flex h-full grow flex-col">
        <Search
          onGameFound={(game) => addGameMutation.mutate({ game: game })}
        />
        <Separator />
        <main className="flex grow flex-col p-4">
          {games.isSuccess && games.data.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {games.data.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
          {games.isSuccess && games.data.length == 0 && (
            <div className="flex w-full grow flex-col items-center justify-center">
              <TypingAnimation className="mb-20 text-lg" duration={25}>
                No games are added yet... Use search bar above!
              </TypingAnimation>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
