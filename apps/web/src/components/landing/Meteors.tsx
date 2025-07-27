import React, { useEffect, useState } from 'react';
import { useViewportSize } from '@mantine/hooks';

import { cn } from '~/lib/utils';

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
}

export function Meteors({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) {
  const [meteorStyles, setMeteorStyles] = useState<React.CSSProperties[]>([]);
  const { width: windowWidth } = useViewportSize();

  useEffect(() => {
    const styles = new Array(number).fill(0).map(() => ({
      '--angle': -angle + 'deg',
      top: '-5%',
      left: `calc(0% + ${Math.floor(Math.random() * windowWidth)}px)`,
      animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + 's',
      animationDuration:
        Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) +
        's',
    }));
    setMeteorStyles(styles);
  }, [
    number,
    minDelay,
    maxDelay,
    minDuration,
    maxDuration,
    angle,
    windowWidth,
  ]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{ ...style }}
          className={cn(
            'pointer-events-none absolute size-0.5 rotate-[var(--angle)] animate-meteor rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]',
            className,
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-[50px] -translate-y-1/2 bg-gradient-to-r from-zinc-500 to-transparent" />
        </span>
      ))}
    </>
  );
}
