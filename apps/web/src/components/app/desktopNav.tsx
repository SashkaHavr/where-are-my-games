import { Fragment } from 'react/jsx-runtime';

import { TwitchIcon } from '../icons';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

interface Props {
  user: { name: string; image?: string | null };
}

const filters = [
  {
    text: 'All',
    platform: 'all',
    icon: TwitchIcon,
  },
  {
    text: 'Steam',
    platform: 'steam',
    icon: TwitchIcon,
  },
];

export function DesktopNav({ user }: Props) {
  return (
    <nav className="flex h-full w-64 flex-col bg-sidebar p-2 text-sidebar-foreground">
      <div className="flex grow flex-col gap-2">
        {filters.map((filter) => (
          <Fragment key={filter.platform}>
            <Button
              className="flex justify-start gap-2"
              variant="ghost"
              size="lg"
            >
              <filter.icon />
              <span>{filter.text}</span>
            </Button>
            {filter.platform == 'all' && <Separator />}
          </Fragment>
        ))}
      </div>
      <Button
        variant="ghost"
        size="lg"
        className="flex h-12 items-center justify-start gap-4 p-2"
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
