import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';

import { auth } from '@where-are-my-games/auth';

export const isAuthenticated = createServerFn().handler(async () => {
  try {
    const session = await auth.api.getSession({
      headers: getWebRequest()!.headers,
    });
    if (session) {
      return true;
    }
  } catch {}
  return false;
});

export async function redirectToHomeIfNotAuthenticated() {
  if (!(await isAuthenticated())) {
    throw redirect({ to: '/' });
  }
}
