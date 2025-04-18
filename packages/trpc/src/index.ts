import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createContext, createContextRaw } from '#context.ts';
import {
  createCallerFactory,
  protectedProcedure,
  publicProcedure,
  router,
} from '#init.ts';

const appRouter = router({
  hello: publicProcedure.query(() => 'Hello from tRPC!'),
  invalidateOnSessionChange: router({
    isAuthorised: publicProcedure.query(async ({ ctx }) => {
      const session = await ctx.auth.getSession({
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
    endpoint: '/trpc',
    createContext: createContext,
  });
}

export type AppRouter = typeof appRouter;
export function createTRPCCaller(
  props: Parameters<typeof createContextRaw>[0],
) {
  return createCallerFactory(appRouter)(createContextRaw(props));
}
