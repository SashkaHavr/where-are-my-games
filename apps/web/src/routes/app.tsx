import { createFileRoute, redirect } from '@tanstack/react-router';

import { Separator } from '~/components/ui/separator';

import { DesktopNav } from '~/components/app/DesktopNav';
import { Search } from '~/components/app/Search';

export const Route = createFileRoute('/app')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/' });
    }
    return {
      user: context.session.user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const user = Route.useRouteContext().user;
  return (
    <div className="flex h-svh w-full flex-col">
      <Search />
      <Separator />
      <div className="flex h-full">
        <DesktopNav user={user} />
        <Separator orientation="vertical" />
        <main className="flex grow flex-col">
          <div className="flex flex-col">
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
            <p>Test</p>
          </div>
        </main>
      </div>
    </div>
  );
}
