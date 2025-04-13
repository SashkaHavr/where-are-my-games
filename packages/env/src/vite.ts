import { createEnv } from '@t3-oss/env-core';

export const envVite = createEnv({
  clientPrefix: 'VITE_',
  client: {},
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
