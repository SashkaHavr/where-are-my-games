import { createTRPCContext } from '@trpc/tanstack-react-query';

import type { AppRouter } from '@where-are-my-games/trpc';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
