import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  createRouter as createTanStackRouter,
  RouterProvider,
} from '@tanstack/react-router';
import { createTRPCClient, httpBatchStreamLink } from '@trpc/client';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import ReactDOM from 'react-dom/client';
import superjson from 'superjson';

import type { AppRouter } from '@where-are-my-games/trpc';
import { envVite } from '@where-are-my-games/env/vite';

import { TRPCProvider } from './lib/trpc';
import { routeTree } from './routeTree.gen';

export function createRouter() {
  const queryClient = new QueryClient({});

  const trpcClient = createTRPCClient<AppRouter>({
    links: [
      httpBatchStreamLink({
        transformer: superjson,
        url: new URL('/trpc', envVite.VITE_API_URL),
      }),
    ],
  });

  const trpcHelpers = createTRPCOptionsProxy({
    client: trpcClient,
    queryClient: queryClient,
  });

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: { queryClient, trpc: trpcHelpers },
    Wrap: (props) => {
      return (
        <QueryClientProvider client={queryClient}>
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            {props.children}
          </TRPCProvider>
        </QueryClientProvider>
      );
    },
  });

  return router;
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={createRouter()} />
    </StrictMode>,
  );
}
