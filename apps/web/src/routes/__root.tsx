import { createRootRoute, Navigate, Outlet } from '@tanstack/react-router';

import { authClient } from '../lib/auth';

export const Route = createRootRoute({
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
