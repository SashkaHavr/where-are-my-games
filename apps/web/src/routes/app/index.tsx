import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';

import { Button } from '../../components/ui/button';
import { authClient } from '../../lib/auth';

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
  return (
    <div className="flex">
      <p>Hello "/app/"!</p>
      <Button
        onClick={() =>
          void authClient.signOut().then(() => router.invalidate())
        }
      >
        Log out
      </Button>
    </div>
  );
}
