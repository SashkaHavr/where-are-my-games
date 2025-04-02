import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { auth } from '@where-are-my-games/auth';

export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({ headers: opts.req.headers });

  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
