import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getWebRequest } from '@tanstack/react-start/server';

import { auth } from '@where-are-my-games/auth';

export const getSession = createServerFn().handler(async () => {
  return await auth.api.getSession({
    headers: getWebRequest()!.headers,
  });
});

export const isAuthenticated = createServerFn().handler(async () => {
  if (await getSession()) {
    return true;
  }
  return false;
});

export const isAuthorized = createServerFn().handler(async () => {
  const session = await getSession();
  if (session?.isAuthorized) {
    return true;
  }
  return false;
});

export async function redirectToHomeIfNotAuthenticated() {
  if (!(await isAuthenticated())) {
    throw redirect({ to: '/' });
  }
}

export async function redirectToHomeIfNotAuthorized() {
  if (!(await isAuthorized())) {
    throw redirect({ to: '/' });
  }
}
