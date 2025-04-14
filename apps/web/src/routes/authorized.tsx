import { redirectToHomeIfNotAuthorized } from '@/lib/authServer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/authorized')({
  component: RouteComponent,
  beforeLoad: async () => {
    await redirectToHomeIfNotAuthorized();
  },
});

function RouteComponent() {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      Hello "/authorized"!
    </div>
  );
}
