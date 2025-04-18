import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { auth } from '@where-are-my-games/auth';
import { envServer } from '@where-are-my-games/env/server';
import { trpcHandler } from '@where-are-my-games/trpc';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.use(
  '/auth/*',
  cors({
    origin: envServer.CORS_ORIGINS,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

app.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.on(['POST', 'GET'], '/trpc/*', (c) => {
  return trpcHandler({ request: c.req.raw });
});

export default {
  port: 3000,
  fetch: app.fetch,
};
