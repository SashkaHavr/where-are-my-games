import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';

import { auth } from '@where-are-my-games/auth';

export const getSession = createServerFn().handler(async () => {
  return await auth.api.getSession({
    headers: getWebRequest()!.headers,
  });
});
