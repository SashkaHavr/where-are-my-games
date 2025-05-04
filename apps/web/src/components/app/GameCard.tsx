import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';

import type { TRPCOutput } from '@where-are-my-games/trpc';

import { trpc } from '~/lib/trpc';
import { gamePlatforms } from '../gamePlatforms';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';

type Game = TRPCOutput['games']['getAll'][number];
interface Props {
  game: Game;
}

export function GameCard({ game }: Props) {
  const queryClient = useQueryClient();
  const platforms = useQuery(
    trpc.games.getPlatforms.queryOptions({ gameId: game.id }),
  );
  const platformsQueryKey = trpc.games.getPlatforms.queryKey({
    gameId: game.id,
  });
  const gamePlatformMutation = useMutation(
    trpc.games.setPlatforms.mutationOptions({
      onMutate: async (input) => {
        await queryClient.cancelQueries({ queryKey: platformsQueryKey });
        const previous = queryClient.getQueryData(platformsQueryKey);
        queryClient.setQueryData(platformsQueryKey, () => input.platforms);
        return { previous };
      },
      onError: (err, newTodo, context) => {
        queryClient.setQueryData(platformsQueryKey, context?.previous);
      },
      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: platformsQueryKey }),
    }),
  );

  return (
    <Card>
      <CardContent className="flex gap-4">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.webp`}
          alt={game.name}
          className="h-40 self-center rounded-sm"
        />
        <div className="flex grow flex-col gap-2">
          <p className="text-xl font-bold">{game.name}</p>
          <Separator />
          <div className="flex gap-1">
            {platforms.isSuccess &&
              platforms.data.map((platform) => {
                const gamePlatform = gamePlatforms.find(
                  (p) => p.key == platform,
                )!;
                return (
                  <div className="w-9 rounded-md border p-2">
                    <gamePlatform.icon />
                  </div>
                );
              })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <PlusIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56"
                side="right"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuLabel>Platforms</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {platforms.isSuccess &&
                  gamePlatforms.map((platform) => (
                    <DropdownMenuCheckboxItem
                      key={platform.key}
                      onSelect={(e) => e.preventDefault()}
                      checked={platforms.data.includes(platform.key)}
                      onCheckedChange={(value) => {
                        gamePlatformMutation.mutate({
                          gameId: game.id,
                          platforms: value
                            ? [...platforms.data, platform.key]
                            : platforms.data.filter((p) => p != platform.key),
                        });
                      }}
                    >
                      <platform.icon />
                      <p>{platform.text}</p>
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
