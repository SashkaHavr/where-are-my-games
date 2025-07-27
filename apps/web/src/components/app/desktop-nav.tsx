import { useRouter } from '@tanstack/react-router';
import { Gamepad2Icon, LogOutIcon } from 'lucide-react';

import type { GamePlatform } from '../game-platforms';
import { useBreakpoint } from '~/hooks/use-breakpoint';
import { authClient } from '~/lib/auth';
import { cn } from '~/lib/utils';
import { gamePlatforms } from '../game-platforms';
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
  const router = useRouter();
  const sm = useBreakpoint('sm');

  return (
    <nav
      className={cn(
        'flex h-full w-16 flex-col bg-sidebar text-sidebar-foreground sm:w-64',
        className,
      )}
    >
      <div className="flex grow flex-col">
        <div className="grid h-14 items-center justify-items-center font-typewriter text-lg font-bold">
          {sm ? <p>Where are my games?</p> : <p>?</p>}
        </div>
        <Separator />
        <div className="flex flex-col gap-1 p-2 pt-8">
          <Button
            className={cn(
              'flex justify-start gap-2',
              filterPlatforms.length == 0 &&
                'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent',
            )}
            variant="ghost"
            size="lg"
            onClick={() => onFilterPlatformsChanged([])}
          >
            <Gamepad2Icon />
            {sm && <span>All</span>}
          </Button>
          <Separator className="my-2" />
          {gamePlatforms
            .filter((p) => availablePlatforms.includes(p.key))
            .map((platform) => (
              <Button
                key={platform.key}
                className={cn(
                  'flex justify-start gap-2',
                  filterPlatforms.includes(platform.key) &&
                    'bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent dark:hover:bg-sidebar-accent',
                )}
                variant="ghost"
                size="lg"
                onClick={() =>
                  onFilterPlatformsChanged(
                    [platform.key],
                    // filterPlatforms.includes(platform.key)
                    //   ? filterPlatforms.filter((p) => p != platform.key)
                    //   : [...filterPlatforms, platform.key],
                  )
                }
              >
                <platform.icon />
                {sm && <span>{platform.text}</span>}
              </Button>
            ))}
        </div>
      </div>
      <div className="m-2 flex flex-col items-center gap-1 sm:flex-row">
        <div className="flex h-12 grow items-center justify-start gap-4 p-2 font-bold">
          <Avatar>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>
              <Skeleton className="h-10 w-10 rounded-full" />
            </AvatarFallback>
          </Avatar>
          {sm && <span className="truncate font-semibold">{user.name}</span>}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-12"
          onClick={() =>
            void authClient.signOut().then(() => router.invalidate())
          }
        >
          <LogOutIcon />
        </Button>
      </div>
    </nav>
  );
}
