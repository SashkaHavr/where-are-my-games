import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import { dbConfig } from './db';

export const envServer = createEnv({
  server: {
    ...dbConfig,

    NODE_ENV: z.enum(['development', 'production']),

    CORS_ORIGINS: z
      .string()
      .optional()
      .transform((s) =>
        s == undefined
          ? ['http://localhost:5173', 'http://localhost:4173']
          : s.split(' '),
      )
      .refine((a) => z.array(z.url()).safeParse(a)),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),

    TWITCH_CLIENT_ID: z.string().nonempty(),
    TWITCH_CLIENT_SECRET: z.string().nonempty(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
