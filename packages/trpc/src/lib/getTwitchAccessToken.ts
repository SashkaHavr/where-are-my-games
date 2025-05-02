import { auth } from '@where-are-my-games/auth';
import { db } from '@where-are-my-games/db';
import { err, ok } from '@where-are-my-games/utils';

export async function getTwitchAccessToken(userId: string) {
  const twitchAccount = await db.query.account.findFirst({
    columns: {
      accessToken: true,
      accessTokenExpiresAt: true,
    },
    where: {
      userId: userId,
      providerId: 'twitch',
    },
  });
  if (!twitchAccount) {
    return err({ message: 'Twitch account was not found' });
  }

  let accessToken: string | undefined | null = twitchAccount.accessToken;
  if (twitchAccount.accessTokenExpiresAt) {
    const now = new Date().valueOf();
    const diffSeconds =
      (twitchAccount.accessTokenExpiresAt.valueOf() - now) / 1000;
    if (diffSeconds < 60) {
      const token = await auth.api.refreshToken({
        body: { providerId: 'twitch', userId: userId },
      });
      accessToken = token.accessToken;
    }
  }

  if (!accessToken) {
    return err({ message: 'Twitch access token was not found' });
  }
  return ok(accessToken);
}
