import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function Hotkey(props: Props) {
  return (
    <kbd className="collapse flex h-5 items-center rounded-md border bg-accent px-1.5 font-sans text-[10px] leading-none text-accent-foreground lg:visible">
      {props.children}
    </kbd>
  );
}
