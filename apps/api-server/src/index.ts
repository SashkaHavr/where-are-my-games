/* eslint-disable no-restricted-exports */
import { app } from '@where-are-my-games/api';

export default {
  port: 5000,
  fetch: app.fetch,
};
