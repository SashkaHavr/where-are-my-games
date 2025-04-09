import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

import '../styles.css';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import { AppRouter } from '@where-are-my-games/trpc';

import { TRPCProvider } from '../trpc';

function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();
  return base + '/api/trpc';
}

const queryClient = new QueryClient();

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: superjson,
      url: getUrl(),
    }),
  ],
});

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  useEffect(() => {
    console.log('Test');
  }, []);
  return (
    // <QueryClientProvider client={queryClient}>
    // <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f472b6',
          },
          contentStyle: {
            backgroundColor: colorScheme == 'dark' ? '#09090B' : '#FFFFFF',
          },
        }}
      />
      <StatusBar />
    </>
    // </TRPCProvider>
    // </QueryClientProvider>
  );
}
