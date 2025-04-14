import type { Context } from '#context.ts';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
      },
    };
  },
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await ctx.auth.getSession({
    headers: ctx.request.headers,
  });
  if (!session) {
    throw new TRPCError({
      message: 'You must authenticate to use this endpoint',
      code: 'UNAUTHORIZED',
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: session,
    },
  });
});
export const authorizedProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.session.isAuthorized) {
      throw new TRPCError({
        message: 'You are not authorized to use this endpoint',
        code: 'FORBIDDEN',
      });
    }
    return next();
  },
);

export const createCallerFactory = t.createCallerFactory;
