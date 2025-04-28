import type { QueryClient } from '@tanstack/react-query';
import type { TRPCOptionsProxy } from '@trpc/tanstack-react-query';
import {
  createRootRouteWithContext,
  Navigate,
  Outlet,
} from '@tanstack/react-router';

import type { AppRouter } from '@where-are-my-games/trpc';

import { authClient } from '../lib/auth';

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
  notFoundComponent: () => <Navigate to="/" />,
});

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  );
}
