import { createAPIFileRoute } from '@tanstack/react-start/api';

import { trpcHandler } from '@where-are-my-games/trpc';

export const APIRoute = createAPIFileRoute('/api/trpc/$')({
  GET: trpcHandler,
  POST: trpcHandler,
});
