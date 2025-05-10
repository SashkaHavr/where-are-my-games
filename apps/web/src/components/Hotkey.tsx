import type { ReactNode } from 'react';

import { useBreakpoint } from '@where-are-my-games/utils';

interface Props {
  children: ReactNode;
}

export function Hotkey(props: Props) {
  const sm = useBreakpoint('sm');

  return (
    sm && (
      <kbd className="flex h-5 items-center rounded-md border bg-accent px-1.5 font-sans text-[10px] leading-none text-accent-foreground">
        {props.children}
      </kbd>
    )
  );
}
