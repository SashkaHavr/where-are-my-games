import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export function createContextRaw({ request }: { request: Request }) {
  return {
    request: request,
  };
}

export function createContext(opts: FetchCreateContextFnOptions) {
  return createContextRaw({ request: opts.req });
}

export type Context = Awaited<ReturnType<typeof createContext>>;
