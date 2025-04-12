import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { auth } from '@where-are-my-games/auth';

export async function createContextRaw(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return {
    session,
  };
}

export async function createContext(opts: FetchCreateContextFnOptions) {
  return createContextRaw(opts.req);
}

export type Context = Awaited<ReturnType<typeof createContext>>;
