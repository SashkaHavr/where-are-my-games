import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const envVite = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_API_URL: z.string().url().optional().default('http://localhost:3000'),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
