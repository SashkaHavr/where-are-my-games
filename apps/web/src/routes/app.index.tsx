import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';

import type { GamePlatform } from '~/components/gamePlatforms';
import { DesktopNav } from '~/components/app/DesktopNav';
import { GameCard } from '~/components/app/GameCard';
import { Search } from '~/components/app/Search';
import { TypingAnimation } from '~/components/landing/TypingAnimation';
import { ThemeToggle } from '~/components/theme/ThemeToggle';
import { trpc } from '~/lib/trpc';

export const Route = createFileRoute('/app/')({
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
    trpc.games.add.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: trpc.games.getAllPlatforms.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.games.getAll.queryKey(),
        });
      },
    }),
  );

  const platforms = useQuery(trpc.games.getAllPlatforms.queryOptions());

  const availablePlatforms = platforms.isSuccess ? platforms.data : [];

  const [filterPlatforms, setFilterPlatforms] = useState<GamePlatform['key'][]>(
    [],
  );
  const filteredGames = games.isSuccess
    ? games.data.filter((game) => {
        if (filterPlatforms.length == 0) {
          return true;
        }
        return (
          game.platforms.filter((p) => filterPlatforms.includes(p)).length > 0
        );
      })
    : [];

  return (
    <div className="flex h-svh w-full">
      <DesktopNav
        user={user}
        className="shrink-0"
        availablePlatforms={availablePlatforms}
        filterPlatforms={filterPlatforms}
        onFilterPlatformsChanged={setFilterPlatforms}
      />
      <Separator orientation="vertical" />
      <div className="flex h-full grow flex-col">
        <div className="flex h-14 w-full shrink-0 items-center">
          <Search
            onGameFound={(game) => addGameMutation.mutate({ game: game })}
          />
          <div className="grow" />
          <ThemeToggle className="mr-4" />
        </div>
        <Separator />
        <main className="flex grow flex-col">
          {games.isSuccess && filteredGames.length > 0 && (
            <ScrollArea className="h-[calc(100svh-57px)] p-4">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </ScrollArea>
          )}
          {games.isSuccess &&
            games.data.length > 0 &&
            filteredGames.length == 0 && (
              <div className="flex w-full grow flex-col items-center justify-center">
                <TypingAnimation className="mb-20 text-lg" duration={25}>
                  No games found for the selected filter 🥲
                </TypingAnimation>
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
