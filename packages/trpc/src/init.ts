import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from '#context.ts';
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
export const protectedProcedure = publicProcedure.use((opts) => {
  if (!opts.ctx.session?.user) {
    throw new TRPCError({ message: 'Not authorised', code: 'FORBIDDEN' });
  }
  return opts.next();
});
