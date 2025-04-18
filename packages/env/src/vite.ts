import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const envVite = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_TRPC_URL: z
      .string()
      .url()
      .optional()
      .default('http://localhost:3000/trpc/'),
    VITE_AUTH_URL: z
      .string()
      .url()
      .optional()
      .default('http://localhost:3000/auth/'),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
