import { useRef, useState } from 'react';
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
import { GameItem } from './GameItem';

// GameItem.div h-24
const GAME_ITEM_HEIGHT = 96;

export function Search() {
  const [searchOpen, setSearchOpen] = useState(false);

  const [searchString, _setSearchString] = useDebouncedState('', 300);
  const setSearchString = (value: string) => {
    setSelectedGameIndex(0);
    _setSearchString(value);
  };
  const searchResult = useQuery(
    trpc.igdb.search.queryOptions(
      { searchString: searchString },
      { enabled: searchString.length > 3 },
    ),
  );

  const scrollArea = useRef<HTMLDivElement>(null);

  const [selectedGameIndex, setSelectedGameIndex] = useState<number>(0);
  const selectedGame =
    searchResult.isSuccess && selectedGameIndex < searchResult.data.length
      ? searchResult.data[selectedGameIndex]
      : undefined;
  const selectGame = (direction: 'next' | 'previous') => {
    if (!searchResult.isSuccess || searchResult.data.length == 0) {
      return;
    }
    const getNextIndex = () => {
      if (selectedGame != undefined) {
        const currentIndex = searchResult.data.indexOf(selectedGame);
        const nextIndex = currentIndex + (direction == 'next' ? 1 : -1);
        if (nextIndex >= searchResult.data.length) {
          return 0;
        } else if (nextIndex < 0) {
          return searchResult.data.length - 1;
        } else {
          return nextIndex;
        }
      }
      return 0;
    };

    const nextIndex = getNextIndex();
    setSelectedGameIndex(nextIndex);
    if (scrollArea.current) {
      const scrollDiv = scrollArea.current;
      const elementTop = nextIndex * GAME_ITEM_HEIGHT;
      const elementBottom = nextIndex * GAME_ITEM_HEIGHT + GAME_ITEM_HEIGHT;
      const scrollTop = scrollDiv.scrollTop;
      const scrollBottom = scrollDiv.scrollTop + scrollDiv.clientHeight;
      if (elementTop < scrollTop) {
        scrollDiv.scrollTo(0, elementTop);
      }
      if (elementBottom > scrollBottom) {
        scrollDiv.scrollTo(0, elementBottom - scrollDiv.clientHeight);
      }
    }
  };

  useHotkeys([
    ['ctrl+K', () => setSearchOpen(!searchOpen)],
    ['ArrowDown', () => selectGame('next')],
    ['ArrowUp', () => selectGame('previous')],
  ]);

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
          <DialogContent className="top-20 flex h-[calc(100vh-140px)] translate-y-0 flex-col p-0 px-4 pb-2 sm:max-w-[80%] lg:max-w-[60%]">
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
                onKeyDown={(e) => {
                  if (e.key == 'ArrowUp') {
                    e.preventDefault();
                    selectGame('previous');
                  }
                  if (e.key == 'ArrowDown') {
                    e.preventDefault();
                    selectGame('next');
                  }
                }}
                onChange={(e) => setSearchString(e.target.value)}
              ></Input>
              <Hotkey>Esc</Hotkey>
            </DialogHeader>
            {searchResult.isSuccess && (
              <ScrollArea className="min-h-0 grow" viewportRef={scrollArea}>
                {searchResult.data.map((game) => (
                  <GameItem
                    key={game.id}
                    game={game}
                    selected={selectedGame == game}
                    onGameSelected={(g) =>
                      setSelectedGameIndex(searchResult.data.indexOf(g))
                    }
                  />
                ))}
              </ScrollArea>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
