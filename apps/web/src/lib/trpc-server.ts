import { createMiddleware } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';

import { createTrpcCaller } from '@where-are-my-games/trpc';

export const trpcServerFnMiddleware = createMiddleware({
  type: 'function',
}).server(({ next }) => {
  return next({
    context: {
      trpc: createTrpcCaller({ request: getWebRequest() }),
    },
  });
});
