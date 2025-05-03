import type { TRPCOutput } from '@where-are-my-games/trpc';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type Game = TRPCOutput['games']['getAll'][number];
interface Props {
  game: Game;
}

export function GameCard({ game }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex w-full flex-col">
          <img
            src={game.cover}
            alt={game.name}
            className="size-20 self-center rounded-sm"
          />
          <p className="bold self-start text-xl">{game.name}</p>
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
