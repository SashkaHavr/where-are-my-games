import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from '@where-are-my-games/auth';

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});
export const { useSession } = authClient;
