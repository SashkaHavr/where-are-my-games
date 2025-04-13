import type { Context } from '#context.ts';
import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import { auth } from '@where-are-my-games/auth';
import { envServer } from '@where-are-my-games/env/server';

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
  const session = await auth.api.getSession({
    headers: ctx.request.headers,
  });
  if (!session) {
    throw new TRPCError({
      message: 'You must authenticate to use this endpoint',
      code: 'UNAUTHORIZED',
    });
  }

  if (!envServer.AUTHORIZED_EMAILS.includes(session.user.email)) {
    throw new TRPCError({
      message: 'You are not authorized to use this endpoint',
      code: 'FORBIDDEN',
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
