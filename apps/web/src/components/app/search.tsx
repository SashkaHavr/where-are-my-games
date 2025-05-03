import { useState } from 'react';
import { useDebouncedState, useHotkeys } from '@mantine/hooks';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useQuery } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';

import { trpc } from '~/lib/trpc';
import { Hotkey } from '../hotkey';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

export function Search() {
  const [searchOpen, setSearchOpen] = useState(false);
  useHotkeys([['ctrl+K', () => setSearchOpen(!searchOpen)]]);

  const [searchString, setSearchString] = useDebouncedState('', 300);

  const searchResult = useQuery(
    trpc.igdb.search.queryOptions(
      { searchString: searchString },
      { enabled: searchString.length > 3 },
    ),
  );

  return (
    <>
      <div className="flex h-14 w-full items-center justify-center">
        <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
          <VisuallyHidden>
            <DialogTitle>Game Search</DialogTitle>
          </VisuallyHidden>
          <DialogTrigger asChild>
            <Button className="flex gap-4">
              <SearchIcon className="size-3.5" />
              <span className="pr-10">Find your game...</span>
              <Hotkey>CTRL + K</Hotkey>
            </Button>
          </DialogTrigger>
          <DialogContent className="top-20 flex h-[calc(100vh-100px)] translate-y-0 flex-col p-0 px-4">
            <VisuallyHidden>
              <DialogDescription>Search input and games</DialogDescription>
            </VisuallyHidden>
            <DialogHeader className="flex flex-row items-center gap-4">
              <SearchIcon className="size-3.5" />
              <Input
                className="border-none bg-background p-0 shadow-none ring-0 focus-visible:border-none focus-visible:ring-0"
                type="text"
                placeholder="Game title..."
                defaultValue={searchString}
                onChange={(e) => setSearchString(e.target.value)}
              ></Input>
              <Hotkey>Esc</Hotkey>
            </DialogHeader>
            {searchResult.isSuccess && (
              <ScrollArea className="h-[calc(100vh-180px)]">
                {searchResult.data.map((game) => (
                  <div
                    className="flex h-24 items-center gap-4 py-2 hover:bg-accent"
                    key={game.id}
                  >
                    <img
                      src={game.cover}
                      alt={game.name}
                      className="size-20 rounded-sm"
                    />
                    <p className="bold text-xl">{game.name}</p>
                  </div>
                ))}
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
