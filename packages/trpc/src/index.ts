import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext } from '#context.ts';
import {
  createCallerFactory,
  protectedProcedure,
  publicProcedure,
  router,
} from '#init.ts';

import { auth } from '@where-are-my-games/auth';

const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC!'),
  invalidateOnSessionChange: router({
    isAuthorised: publicProcedure.query(async ({ ctx }) => {
      const session = await auth.api.getSession({
        headers: ctx.request.headers,
      });
      return session != undefined;
    }),
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
export function createTRPCCaller(request: Request) {
  return createCallerFactory(appRouter)({ request });
}
