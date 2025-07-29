import { useState } from 'react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useTranslations } from 'use-intl';

import { ScrollArea } from '~/components/ui/scroll-area';
import { Separator } from '~/components/ui/separator';

import type { GamePlatform } from '~/components/game-platforms';
import { GameCard } from '~/components/app/game-card';
import { MainNav } from '~/components/app/main-nav';
import { Search } from '~/components/app/search';
import { TypingAnimation } from '~/components/landing/typing-animation';
import { ThemeToggle } from '~/components/theme-toggle';
import { useLoggedInAuth } from '~/lib/route-context-hooks';
import { useTRPC } from '~/lib/trpc';
import { gamesGetAllServerFn } from '~/lib/trpc-server';

export const Route = createFileRoute('/{-$locale}/app/')({
  beforeLoad: ({ context }) => {
    if (!context.auth.loggedIn) {
      throw redirect({ to: '/{-$locale}' });
    }
  },
  loader: async ({ context: { queryClient, trpc } }) => {
    await queryClient.ensureQueryData({
      queryKey: trpc.games.getAll.queryKey(),
      queryFn: () => gamesGetAllServerFn(),
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  const t = useTranslations('appIndex');
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { user } = useLoggedInAuth();

  const games = useSuspenseQuery(trpc.games.getAll.queryOptions());
  const addGameMutation = useMutation(
    trpc.games.add.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.games.getAll.queryKey(),
        });
      },
    }),
  );

  const platforms = games.data
    .map((game) => game.platforms)
    .flat()
    .filter((p, index, arr) => arr.indexOf(p) == index);

  const [filterPlatforms, setFilterPlatforms] = useState<GamePlatform['key'][]>(
    [],
  );
  const filteredGames = games.data.filter((game) => {
    if (filterPlatforms.length == 0) {
      return true;
    }
    return game.platforms.filter((p) => filterPlatforms.includes(p)).length > 0;
  });

  return (
    <div className="flex h-svh w-full">
      <MainNav
        user={user}
        className="shrink-0"
        availablePlatforms={platforms}
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
          {filteredGames.length > 0 && (
            <ScrollArea className="h-[calc(100svh-57px)] p-4">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
                {filteredGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </ScrollArea>
          )}
          {games.data.length > 0 && filteredGames.length == 0 && (
            <div className="flex w-full grow flex-col items-center justify-center">
              <TypingAnimation className="mb-20 text-lg" duration={25}>
                {t('noGamesFound')}
              </TypingAnimation>
            </div>
          )}
          {games.data.length == 0 && (
            <div className="flex w-full grow flex-col items-center justify-center">
              <TypingAnimation className="mb-20 text-lg" duration={25}>
                {t('noGamesAdded')}
              </TypingAnimation>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
