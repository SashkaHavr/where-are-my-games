import { betterAuth, BetterAuthError } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, magicLink } from 'better-auth/plugins';

import { db } from '@where-are-my-games/db';
import { envAuth } from '@where-are-my-games/env/auth';

import { permissions } from '#permissions.ts';
import { refreshAccessToken } from '#twitch/refreshAccessToken.ts';

export const auth = betterAuth({
  basePath: '/auth',
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {
    twitch: {
      clientId: envAuth.TWITCH_CLIENT_ID,
      clientSecret: envAuth.TWITCH_CLIENT_SECRET,
      refreshAccessToken: (refreshToken) =>
        refreshAccessToken({
          refreshToken: refreshToken,
          options: {
            clientId: envAuth.TWITCH_CLIENT_ID,
            clientSecret: envAuth.TWITCH_CLIENT_SECRET,
          },
        }),
    },
  },
  rateLimit: {
    customRules: {
      '/sign-in/magic-link': {
        window: 60,
        max: 1,
      },
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: ({ url, email }, request) => {
        if (!request) {
          throw new BetterAuthError('sendMagicLink: Request is not defined');
        }

        if (envAuth.AUTH_DEV_MAGIC_LINK && /^\S+@example\.com$/.test(email)) {
          console.log(`${email} - ${url}`);
          return;
        }
      },
    }),
    admin({
      ...permissions,
    }),
  ],
});
