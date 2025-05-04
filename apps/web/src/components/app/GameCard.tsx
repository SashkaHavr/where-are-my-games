import type { TRPCOutput } from '@where-are-my-games/trpc';

import { Card, CardContent } from '../ui/card';

type Game = TRPCOutput['games']['getAll'][number];
interface Props {
  game: Game;
}

export function GameCard({ game }: Props) {
  return (
    <Card>
      <CardContent className="flex gap-4">
        <img
          src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.webp`}
          alt={game.name}
          className="h-40 self-center rounded-sm"
        />
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold">{game.name}</p>
        </div>
      </CardContent>
    </Card>
  );
}
