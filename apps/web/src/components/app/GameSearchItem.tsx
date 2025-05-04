import type { TRPCOutput } from '@where-are-my-games/trpc';

type Game = TRPCOutput['igdb']['search'][number];
interface Props {
  game: Game;
  selected: boolean;
  onGameSelected: (game: Game) => void;
  onGameFound: (game: Game) => void;
}

export function GameSearchItem({
  game,
  selected,
  onGameSelected,
  onGameFound,
}: Props) {
  return (
    <div
      aria-selected={selected}
      className="flex h-24 items-center gap-4 px-4 py-2 aria-selected:bg-accent"
      onMouseMove={() => onGameSelected(game)}
      onClick={() => onGameFound(game)}
    >
      <img
        src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover}.webp`}
        alt={game.name}
        className="size-20 rounded-sm"
      />
      <p className="bold text-xl">{game.name}</p>
    </div>
  );
}
