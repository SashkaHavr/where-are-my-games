import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@where-are-my-games/db';
import { envServer } from '@where-are-my-games/env/server';

export const auth = betterAuth({
  basePath: '/auth',
  trustedOrigins: envServer.CORS_ORIGINS,
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // Cache duration in seconds
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {
    twitch: {
      clientId: envServer.TWITCH_CLIENT_ID,
      clientSecret: envServer.TWITCH_CLIENT_SECRET,
    },
  },
});
