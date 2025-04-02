import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '#context.ts';
import { protectedProcedure, publicProcedure, router } from '#init.ts';

const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC!'),
  invalidateOnSessionChange: router({
    isAuthorised: publicProcedure.query(
      ({ ctx }) => ctx.session?.user != undefined,
    ),
    protectedHello: protectedProcedure.query(() => 'Protected hello from tRPC'),
  }),
});

export function trpcHandler({ request }: { request: Request }) {
  return fetchRequestHandler({
    req: request,
    router: appRouter,
    endpoint: '/api/trpc',
    createContext: createContext,
  });
}

export type AppRouter = typeof appRouter;
