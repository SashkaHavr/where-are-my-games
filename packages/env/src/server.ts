import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

import { dbConfig } from './db';

export const envServer = createEnv({
  server: {
    ...dbConfig,

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url(),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),

    AUTHORIZED_EMAILS: z
      .string()
      .optional()
      .transform((s) => (s == undefined ? [] : s.split(' ')))
      .refine((a) => z.array(z.string().email()).safeParse(a)),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
