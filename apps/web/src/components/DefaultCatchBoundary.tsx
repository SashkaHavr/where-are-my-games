import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent, Link, useRouter } from '@tanstack/react-router';

import { Button } from '@where-are-my-games/ui/button.tsx';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="p-4 gap-4 flex flex-col items-center">
      <p className="text-2xl font-bold">Something went wrong 😢</p>
      {import.meta.env.DEV && <ErrorComponent error={error} />}
      <div className="gap-2 flex flex-wrap items-center">
        {import.meta.env.DEV && (
          <Button
            onClick={() => {
              void router.invalidate();
            }}
            variant="destructive"
          >
            Try Again
          </Button>
        )}
        <Button>
          <Link to="/">Home Page</Link>
        </Button>
        <Button variant="outline">
          <Link to="/" onClick={() => window.history.back()}>
            Go Back
          </Link>
        </Button>
      </div>
    </div>
  );
}
