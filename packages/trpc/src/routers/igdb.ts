import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import igdb from 'igdb-api-node';
import { z } from 'zod';

import { account } from '@where-are-my-games/db/schema';
import { envServer } from '@where-are-my-games/env/server';
import { tryCatch } from '@where-are-my-games/utils';

import { protectedProcedure, router } from '#init.ts';

interface IGDBGame {
  id: number;
  name: string;
  cover: {
    id: number;
    url: string;
  };
  first_release_date: number;
  genres: {
    id: number;
    name: string;
  }[];
  slug: string;
  summary: string;
}

const igdbGame = z.object({
  id: z.number().nonnegative(),
  name: z.string().nonempty(),
  cover: z.string().url(),
  firstReleaseDate: z.number().nonnegative(),
  genres: z.array(z.string()),
  slug: z.string(),
  summary: z.string(),
});

export const igdbRouter = router({
  search: protectedProcedure
    .input(z.object({ searchString: z.string() }))
    .output(z.array(igdbGame))
    .query(async ({ input, ctx }) => {
      const twitchAccount = await ctx.db.query.account.findFirst({
        columns: {
          accessToken: true,
          accessTokenExpiresAt: true,
        },
        where: and(
          eq(account.userId, ctx.session.user.id),
          eq(account.providerId, 'twitch'),
        ),
      });
      if (!twitchAccount) {
        throw new TRPCError({
          message: 'Twitch account was not found',
          code: 'UNAUTHORIZED',
        });
      }

      let accessToken: string | undefined | null = twitchAccount.accessToken;
      if (twitchAccount.accessTokenExpiresAt) {
        const now = new Date().valueOf();
        const diffSeconds =
          (twitchAccount.accessTokenExpiresAt.valueOf() - now) / 1000;
        if (diffSeconds < 60) {
          const token = await ctx.auth.refreshToken({
            body: { providerId: 'twitch', userId: ctx.session.user.id },
          });
          accessToken = token.accessToken;
        }
      }

      if (!accessToken) {
        throw new TRPCError({
          message: 'Twitch account was not found',
          code: 'UNAUTHORIZED',
        });
      }

      const result = await tryCatch<
        { data: IGDBGame[] },
        { response: { data: unknown } }
      >(
        igdb(envServer.TWITCH_CLIENT_ID, accessToken)
          .fields([
            'cover.url',
            'first_release_date',
            'name',
            'slug',
            'summary',
            'genres.name',
          ])
          .limit(10)
          .search(input.searchString)
          .where([
            'cover != n',
            'genres != n',
            'first_release_date != n',
            'summary != n',
          ])
          .request('/games'),
      );
      if (result.data) {
        return result.data.data
          .map(
            (game) =>
              ({
                id: game.id,
                name: game.name,
                cover: 'https:' + game.cover.url,
                firstReleaseDate: game.first_release_date,
                genres: game.genres.map((g) => g.name),
                slug: game.slug,
                summary: game.summary,
              }) satisfies z.infer<typeof igdbGame>,
          )
          .map((game) => igdbGame.safeParse(game))
          .filter((game) => game.success)
          .map((game) => game.data);
      } else {
        console.log(result.error.response.data);
      }
      return [];
    }),
});
