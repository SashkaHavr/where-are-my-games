import { useHover } from '@mantine/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import type { TRPCOutput } from '@where-are-my-games/trpc';
import { cn } from '@where-are-my-games/utils';

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

  const gamePlatformsMutation = useMutation(
    trpc.games.setPlatforms.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: trpc.games.getAllPlatforms.queryKey(),
        });
        void queryClient.invalidateQueries({
          queryKey: trpc.games.getPlatforms.queryKey({ gameId: game.id }),
        });
      },
    }),
  );

  const deleteGameMutation = useMutation(
    trpc.games.delete.mutationOptions({
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
                        gamePlatformsMutation.mutate({
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
