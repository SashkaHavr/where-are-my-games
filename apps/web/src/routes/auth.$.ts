import { createServerFileRoute } from '@tanstack/react-start/server';

import { auth } from '@where-are-my-games/auth';

export const ServerRoute = createServerFileRoute('/auth/$').methods({
  GET: async ({ request }) => {
    return auth.handler(request);
  },
  POST: async ({ request }) => {
    return auth.handler(request);
  },
});
