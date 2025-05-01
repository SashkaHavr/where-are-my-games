import superjson from 'superjson';
import { ZodError } from 'zod';

import { envServer } from '@where-are-my-games/env/server';

import type { Context } from '#context.ts';
import { initTRPC, TRPCError } from '@trpc/server';

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

export const publicProcedure =
  envServer.NODE_ENV == 'production'
    ? t.procedure
    : t.procedure.use(async ({ next }) => {
        const result = await next();
        if (!result.ok) {
          console.error(
            result.error,
            // `${result.error.name} ${result.error.code} ${result.error.message}`,
          );
        }
        return result;
      });

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

export const createCallerFactory = t.createCallerFactory;
