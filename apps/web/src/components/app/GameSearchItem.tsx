import type { TRPCOutput } from '@where-are-my-games/trpc';

type Game = TRPCOutput['igdb']['search'][number];
interface Props {
  game: Game;
  selected: boolean;
  onGameSelected: (game: Game) => void;
}

export function GameSearchItem({ game, selected, onGameSelected }: Props) {
  return (
    <div
      aria-selected={selected}
      className="flex h-24 items-center gap-4 px-4 py-2 aria-selected:bg-accent"
      onMouseMove={() => onGameSelected(game)}
    >
      <img src={game.cover} alt={game.name} className="size-20 rounded-sm" />
      <p className="bold text-xl">{game.name}</p>
    </div>
  );
}
