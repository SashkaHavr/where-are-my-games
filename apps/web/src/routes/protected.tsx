import { redirectToHomeIfNotAuthenticated } from '@/lib/authServer';
import { trpcMiddleware } from '@/lib/trpcServer';
import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const protectedHello = createServerFn()
  .middleware([trpcMiddleware])
  .handler(({ context }) =>
    context.trpc.invalidateOnSessionChange.protectedHello(),
  );

export const Route = createFileRoute('/protected')({
  component: RouteComponent,
  beforeLoad: async () => {
    await redirectToHomeIfNotAuthenticated();
  },
  loader: async () => {
    return await protectedHello();
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <p>Hello "/protected"!</p>
      <p>{data}</p>
      <Link className="text-blue-500 underline" to="/">
        Back to main
      </Link>
    </div>
  );
}
