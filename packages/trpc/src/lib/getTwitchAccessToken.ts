import { auth } from '@where-are-my-games/auth';
import { db } from '@where-are-my-games/db';

import { TwitchError } from '#utils/error.ts';

export async function getTwitchAccessToken(userId: string) {
  const twitchAccount = await db.query.account.findFirst({
    columns: {
      id: true,
      accessToken: true,
      accessTokenExpiresAt: true,
    },
    where: {
      userId: userId,
      providerId: 'twitch',
    },
  });
  if (!twitchAccount) {
    throw new TwitchError({ message: 'Twitch account was not found' });
  }

  let accessToken: string | undefined | null = twitchAccount.accessToken;
  if (twitchAccount.accessTokenExpiresAt) {
    const now = new Date().valueOf();
    const diffSeconds =
      (twitchAccount.accessTokenExpiresAt.valueOf() - now) / 1000;
    if (diffSeconds < 60) {
      const token = await auth.api.refreshToken({
        body: {
          providerId: 'twitch',
          userId: userId,
          accountId: twitchAccount.id,
        },
      });
      accessToken = token.accessToken;
    }
  }

  if (!accessToken) {
    throw new TwitchError({ message: 'Twitch access token was not found' });
  }
  return accessToken;
}
