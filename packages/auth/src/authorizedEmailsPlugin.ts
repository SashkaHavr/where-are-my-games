import { customSession } from 'better-auth/plugins';

export function authorizedEmailsPlugin(authorizedEmails: string[]) {
  return customSession(async ({ user, session }) => {
    await Promise.resolve();
    return {
      isAuthorized: authorizedEmails.includes(user.email),
      user,
      session,
    };
  });
}
