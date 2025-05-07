import { useHover } from '@mantine/hooks';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import type { TRPCOutput } from '@where-are-my-games/trpc';
import { cn, useOptimisticUpdate } from '@where-are-my-games/utils';

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
  const platforms = useQuery(
    trpc.games.getPlatforms.queryOptions({ gameId: game.id }),
  );
  const gamePlatformMutation = useMutation(
    trpc.games.setPlatforms.mutationOptions(
      useOptimisticUpdate(
        trpc.games.getPlatforms.queryKey({
          gameId: game.id,
        }),
        (old, input) => input.platforms,
      ),
    ),
  );

  const deleteGameMutation = useMutation(
    trpc.games.delete.mutationOptions(
      useOptimisticUpdate(trpc.games.getAll.queryKey(), (old, input) =>
        old ? old.filter((g) => g.id != input.gameId) : [],
      ),
    ),
  );

  const { hovered, ref } = useHover();

  return (
    <Card ref={ref}>
      <CardContent className="flex gap-4">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.webp`}
          alt={game.name}
          className="h-48 self-center rounded-sm"
        />
        <div className="flex grow flex-col gap-2">
          <div className="flex items-center gap-1">
            <p className="grow text-xl font-bold">{game.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'shrink-0 self-start justify-self-end opacity-0',
                hovered && 'opacity-100',
              )}
              onClick={() => deleteGameMutation.mutate({ gameId: game.id })}
            >
              <Trash2Icon />
            </Button>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-1">
            {platforms.isSuccess &&
              platforms.data.map((platform) => {
                const gamePlatform = gamePlatforms.find(
                  (p) => p.key == platform,
                )!;
                return (
                  <div className="w-9 rounded-md border p-2" key={platform}>
                    <gamePlatform.icon />
                  </div>
                );
              })}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="justify-self-end"
                >
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
