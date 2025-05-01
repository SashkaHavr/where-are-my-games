import { useDebouncedState } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { authClient } from '~/lib/auth';
import { useTRPC } from '~/lib/trpc';

export const Route = createFileRoute('/app/')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const trpc = useTRPC();
  const [searchString, setSearchString] = useDebouncedState('', 300);

  const searchResult = useQuery(
    trpc.igdb.search.queryOptions(
      { searchString: searchString },
      { enabled: searchString.length > 3 },
    ),
  );
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-10">
        <Input
          className="w-80"
          type="text"
          placeholder="Search string"
          defaultValue={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          {searchResult.isSuccess &&
            searchResult.data.map((game) => <p key={game.id}>{game.cover}</p>)}
        </div>
      </div>
      <Button
        className="w-20"
        onClick={() =>
          void authClient.signOut().then(() => router.invalidate())
        }
      >
        Log out
      </Button>
    </div>
  );
}
