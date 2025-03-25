import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { hello } from './routes/hello';

export const app = new Hono().use(cors()).route('/hello', hello);

export type AppType = typeof app;
