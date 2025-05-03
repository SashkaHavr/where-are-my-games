import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect } from '@tanstack/react-router';

import { DesktopNav } from '~/components/app/DesktopNav';
import { GameCard } from '~/components/app/GameCard';
import { Search } from '~/components/app/Search';
import { TypingAnimation } from '~/components/landing/TypingAnimation';
import { Separator } from '~/components/ui/separator';
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
  const user = Route.useRouteContext().user;
  const games = useQuery(trpc.games.getAll.queryOptions());
  return (
    <div className="flex h-svh w-full">
      <DesktopNav user={user} />
      <Separator orientation="vertical" />
      <div className="flex h-full grow flex-col">
        <Search />
        <Separator />
        <main className="flex grow flex-col">
          {games.isSuccess && games.data.length > 0 && (
            <div className="flex flex-wrap gap-4">
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
