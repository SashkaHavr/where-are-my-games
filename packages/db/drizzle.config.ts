import { defineConfig } from 'drizzle-kit';

import { envServer } from '@where-are-my-games/env-server';

export default defineConfig({
  out: './drizzle',
  schema: './src/schema',
  dialect: 'postgresql',
  dbCredentials: {
    host: envServer.DATABASE_HOST,
    port: envServer.DATABASE_PORT,
    database: envServer.DATABASE_NAME,
    user: envServer.DATABASE_USER,
    password: envServer.DATABASE_PASSWORD,
    ssl: envServer.DATABASE_SSL,
  },
});
