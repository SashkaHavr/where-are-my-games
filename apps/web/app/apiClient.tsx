import { hc } from 'hono/client';

import type { AppType } from '@where-are-my-games/api';

export const api = hc<AppType>('http://localhost:5000');
