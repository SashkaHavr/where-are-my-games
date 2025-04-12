import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@where-are-my-games/db';
import { envServer } from '@where-are-my-games/env';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {
    github:
      envServer.GITHUB_CLIENT_ID && envServer.GITHUB_CLIENT_SECRET
        ? {
            clientId: envServer.GITHUB_CLIENT_ID,
            clientSecret: envServer.GITHUB_CLIENT_SECRET,
          }
        : undefined,
  },
});
