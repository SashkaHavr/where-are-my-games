import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { auth } from '@where-are-my-games/auth';
import { envServer } from '@where-are-my-games/env/server';

export function createContextRaw({ request }: { request: Request }) {
  return {
    request: request,
    auth: auth.api,
    env: envServer,
  };
}

export function createContext(opts: FetchCreateContextFnOptions) {
  return createContextRaw({ request: opts.req });
}

export type Context = Awaited<ReturnType<typeof createContext>>;
