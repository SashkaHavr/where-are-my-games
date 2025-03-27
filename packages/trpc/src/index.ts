import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { publicProcedure, router } from '#init.ts';

const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC!'),
});

export function trpcHandler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: '/api/trpc',
  });
}

export type AppRouter = typeof appRouter;
