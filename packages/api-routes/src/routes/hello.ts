import { Hono } from 'hono';

export const hello = new Hono().get('', (c) => {
  return c.text('Hello Hono!');
});
