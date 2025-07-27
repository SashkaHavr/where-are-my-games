/// <reference types="vite/client" />

import type { ReactNode } from 'react';
import {
  createRootRouteWithContext,
  HeadContent,
  isMatch,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';

import { defaultLocale } from '@where-are-my-games/intl';

import type { TRPCRouteContext } from '~/lib/trpc';
import { getAuthContext } from '~/lib/auth';
import indexCss from '../index.css?url';

export const Route = createRootRouteWithContext<TRPCRouteContext>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    return {
      auth: await getAuthContext(queryClient),
    };
  },
  component: RootComponent,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Where are my games?',
      },
      { name: 'robots', content: 'noindex, nofollow' },
      {
        name: 'description',
        content: `Lost in a jungle of game launchers? This handy little app remembers where you bought your games, so you don't have to!`,
      },
    ],
    links: [
      { rel: 'stylesheet', href: indexCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <ThemeProvider attribute="class">
        <Outlet />
      </ThemeProvider>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const matches = useRouterState({ select: (s) => s.matches }).filter((m) =>
    isMatch(m, 'context.intl.locale'),
  );
  const locale = matches[0]?.context.intl.locale ?? defaultLocale;

  return (
    <html suppressHydrationWarning lang={locale}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
