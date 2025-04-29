import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '@where-are-my-games/auth';

import { getApiUrl } from '../utils/getApiUrl';

export const authClient = createAuthClient({
  baseURL: getApiUrl(),
  basePath: '/auth',
  plugins: [inferAdditionalFields<typeof auth>()],
});
