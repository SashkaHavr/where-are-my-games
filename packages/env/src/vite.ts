import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const envVite = createEnv({
  clientPrefix: 'VITE_',
  client: {
    VITE_TEST: z.string(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
