import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@where-are-my-games/ui/button.tsx';

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="flex h-lvh flex-col items-center justify-center gap-4 px-4 pb-20">
      <div>
        {children ?? (
          <p className="text-center text-2xl font-bold">
            The page you are looking for does not exist 😢
          </p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link to="/">Home page</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    </div>
  );
}
