import { trpcMiddleware } from '@/lib/trpcMiddlewareServerFn';
import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const protectedHello = createServerFn()
  .middleware([trpcMiddleware])
  .handler(({ context }) =>
    context.trpc.invalidateOnSessionChange.protectedHello(),
  );

export const Route = createFileRoute('/protected')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' });
    }
  },
  loader: () => protectedHello(),
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return (
    <div className="gap-2 flex w-full flex-col items-center">
      <p>Hello "/protected"!</p>
      <p>{data}</p>
      <Link className="text-blue-500 underline" to="/">
        Back to main
      </Link>
    </div>
  );
}
