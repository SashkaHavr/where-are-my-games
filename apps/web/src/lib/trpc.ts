import { QueryClient } from '@tanstack/react-query';
import { createTRPCClient, httpBatchStreamLink, httpLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import superjson from 'superjson';

import type { TRPCRouter } from '@where-are-my-games/trpc';

export const queryClient = new QueryClient({});

const trpcLink = import.meta.env.DEV ? httpLink : httpBatchStreamLink;
const trpcClient = createTRPCClient<TRPCRouter>({
  links: [
    trpcLink({
      transformer: superjson,
      url: new URL('/trpc', import.meta.env.VITE_API_URL),
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

export const trpc = createTRPCOptionsProxy({
  client: trpcClient,
  queryClient: queryClient,
});
