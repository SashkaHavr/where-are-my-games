import { createTRPCContext } from '@trpc/tanstack-react-query';

import { AppRouter } from '@where-are-my-games/trpc';

export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();
