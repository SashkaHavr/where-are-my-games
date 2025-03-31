import { drizzle } from 'drizzle-orm/node-postgres';

import { envServer } from '@where-are-my-games/env-server';

import * as schema from './schema';

export const db = drizzle({
  connection: {
    host: envServer.DATABASE_HOST,
    port: envServer.DATABASE_PORT,
    database: envServer.DATABASE_NAME,
    user: envServer.DATABASE_USER,
    password: envServer.DATABASE_PASSWORD,
    ssl: envServer.DATABASE_SSL,
  },
  schema: schema,
  casing: 'snake_case',
});
