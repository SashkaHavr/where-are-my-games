import { createMiddleware } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';

import { createTRPCCaller } from '@where-are-my-games/trpc';

export const trpcMiddleware = createMiddleware().server(async ({ next }) => {
  return await next({
    context: {
      trpc: await createTRPCCaller(getWebRequest()!),
    },
  });
});
