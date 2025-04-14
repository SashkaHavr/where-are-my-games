import type { ErrorComponentProps } from '@tanstack/react-router';
import { ErrorComponent, Link, useRouter } from '@tanstack/react-router';

import { Button } from '@where-are-my-games/ui/button.tsx';

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter();

  return (
    <div className="flex h-lvh flex-col items-center justify-center gap-4 px-4 pb-20">
      <p className="text-2xl font-bold">Something went wrong 😢</p>
      {import.meta.env.DEV && <ErrorComponent error={error} />}
      <div className="flex flex-wrap items-center gap-2">
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
