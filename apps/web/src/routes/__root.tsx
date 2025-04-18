import type { QueryClient } from '@tanstack/react-query';
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import type { AppRouter } from '@where-are-my-games/trpc';

import { NotFound } from '../components/NotFound';
import { authClient } from '../lib/auth';

// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy<AppRouter>;
}>()({
  beforeLoad: async () => {
    return {
      session: (await authClient.getSession()).data,
    };
  },
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
