import { Gamepad2Icon } from 'lucide-react';

import { cn } from '@where-are-my-games/utils';

import type { GamePlatform } from '../gamePlatforms';
import { gamePlatforms } from '../gamePlatforms';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

interface Props {
  className?: string;
  user: { name: string; image?: string | null };
  availablePlatforms: GamePlatform['key'][];
  filterPlatforms: GamePlatform['key'][];
  onFilterPlatformsChanged: (value: GamePlatform['key'][]) => void;
}

export function DesktopNav({
  user,
  className,
  availablePlatforms,
  filterPlatforms,
  onFilterPlatformsChanged,
}: Props) {
  return (
    <nav
      className={cn(
        'flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground',
        className,
      )}
    >
      <div className="flex grow flex-col">
        <div className="grid h-14 items-center justify-items-center font-typewriter text-lg font-bold">
          <p>Where are my games?</p>
        </div>
        <Separator />
        <div className="flex flex-col p-2 pt-8">
          <Button
            className="flex justify-start gap-2 aria-selected:bg-accent"
            variant="ghost"
            size="lg"
            aria-selected={filterPlatforms.length == 0}
            onClick={() => onFilterPlatformsChanged([])}
          >
            <Gamepad2Icon />
            <span>All</span>
          </Button>
          <Separator className="my-2" />
          {gamePlatforms
            .filter((p) => availablePlatforms.includes(p.key))
            .map((platform) => (
              <Button
                key={platform.key}
                className="flex justify-start gap-2 aria-selected:bg-sidebar-accent aria-selected:text-sidebar-accent-foreground"
                variant="ghost"
                size="lg"
                aria-selected={filterPlatforms.includes(platform.key)}
                onClick={() =>
                  onFilterPlatformsChanged(
                    filterPlatforms.includes(platform.key)
                      ? filterPlatforms.filter((p) => p != platform.key)
                      : [...filterPlatforms, platform.key],
                  )
                }
              >
                <platform.icon />
                <span>{platform.text}</span>
              </Button>
            ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="lg"
        className="m-2 flex h-12 items-center justify-start gap-4 p-2"
      >
        <Avatar>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>
            <Skeleton className="h-10 w-10 rounded-full" />
          </AvatarFallback>
        </Avatar>
        <span className="truncate font-semibold">{user.name}</span>
      </Button>
    </nav>
  );
}
