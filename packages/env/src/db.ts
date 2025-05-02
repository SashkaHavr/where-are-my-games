import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const dbConfig = {
  DATABASE_HOST: z.string().default('localhost'),
  DATABASE_PORT: z
    .string()
    .transform((str) => parseInt(str))
    .pipe(z.number())
    .default(5432),
  DATABASE_NAME: z.string(),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_SSL: z
    .string()
    .refine((s) => s === 'true' || s === 'false')
    .transform((s) => s === 'true')
    .default(true),
};

export const envDB = createEnv({
  server: { ...dbConfig },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
