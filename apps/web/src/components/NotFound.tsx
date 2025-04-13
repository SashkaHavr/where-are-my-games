import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';

import { Button } from '@where-are-my-games/ui/button.tsx';

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div className="gap-4 p-4 flex flex-col items-center">
      <div>
        {children ?? (
          <p className="text-2xl font-bold">
            The page you are looking for does not exist 😢
          </p>
        )}
      </div>
      <p className="gap-2 flex flex-wrap items-center">
        <Button>
          <Link to="/">Home page</Link>
        </Button>
        <Button variant="outline" onClick={() => window.history.back()}>
          Go back
        </Button>
      </p>
    </div>
  );
}
