import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '@where-are-my-games/auth';
import { envVite } from '@where-are-my-games/env/vite';

export const authClient = createAuthClient({
  baseURL: envVite.VITE_API_URL,
  basePath: '/auth',
  plugins: [inferAdditionalFields<typeof auth>()],
});
