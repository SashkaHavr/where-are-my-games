import { useHover } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import type { TRPCOutput } from '@where-are-my-games/trpc';

import { useTRPC } from '~/lib/trpc';
import { cn } from '~/lib/utils';
import { gamePlatforms } from '../game-platforms';
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
  const trpc = useTRPC();

  const gamePlatformsMutation = useMutation(
    trpc.games.setPlatforms.mutationOptions({
      onSuccess: (_, vars) => {
        queryClient.setQueryData(trpc.games.getAll.queryKey(), (games) => {
          if (!games) return games;
          return games.map((g) => {
            if (g.id === game.id) {
              return {
                ...g,
                platforms: vars.platforms,
              };
            }
            return g;
          });
        });
      },
    }),
  );

  const deleteGameMutation = useMutation(
    trpc.games.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.games.getAll.queryKey(),
        });
      },
    }),
  );

  const { hovered, ref } = useHover();

  return (
    <Card ref={ref}>
      <CardContent className="flex gap-4">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.webp`}
          alt={game.name}
          className="h-32 rounded-sm sm:h-48"
        />
        <div className="flex grow flex-col gap-2">
          <div className="flex items-center gap-1">
            <p className="grow text-lg font-bold sm:text-xl">{game.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'shrink-0 self-start justify-self-end sm:opacity-0',
                hovered && 'sm:opacity-100',
              )}
              onClick={() => deleteGameMutation.mutate({ gameId: game.id })}
            >
              <Trash2Icon />
            </Button>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-1">
            {game.platforms.map((platform) => {
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
                {gamePlatforms.map((platform) => (
                  <DropdownMenuCheckboxItem
                    key={platform.key}
                    onSelect={(e) => e.preventDefault()}
                    checked={game.platforms.includes(platform.key)}
                    onCheckedChange={(value) => {
                      gamePlatformsMutation.mutate({
                        gameId: game.id,
                        platforms: value
                          ? [...game.platforms, platform.key]
                          : game.platforms.filter((p) => p != platform.key),
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
