import { defineConfig } from 'drizzle-kit';

import { envDB } from '@where-are-my-games/env/db';

export default defineConfig({
  out: './drizzle',
  schema: './src/schema',
  dialect: 'postgresql',
  dbCredentials: {
    host: envDB.DATABASE_HOST,
    port: envDB.DATABASE_PORT,
    database: envDB.DATABASE_NAME,
    user: envDB.DATABASE_USER,
    password: envDB.DATABASE_PASSWORD,
    ssl: envDB.DATABASE_SSL,
  },
  casing: 'snake_case',
});
