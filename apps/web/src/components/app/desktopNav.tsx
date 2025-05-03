import { cn } from '@where-are-my-games/utils';

import { TwitchIcon } from '../icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

interface Props {
  className?: string;
  user: { name: string; image?: string | null };
}

const filters = [
  {
    text: 'Steam',
    platform: 'steam',
    icon: TwitchIcon,
  },
  {
    text: 'Epic Games Store',
    platform: 'egs',
    icon: TwitchIcon,
  },
];

export function DesktopNav({ user, className }: Props) {
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
            className="flex justify-start gap-2"
            variant="ghost"
            size="lg"
          >
            <TwitchIcon />
            <span>All</span>
          </Button>
          <Separator className="my-2" />
          {filters.map((filter) => (
            <Button
              key={filter.platform}
              className="flex justify-start gap-2"
              variant="ghost"
              size="lg"
            >
              <filter.icon />
              <span>{filter.text}</span>
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
