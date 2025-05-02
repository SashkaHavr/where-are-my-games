import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { envServer } from '@where-are-my-games/env/server';

import { protectedProcedure, router } from '#init.ts';
import { getTwitchAccessToken } from '#lib/getTwitchAccessToken.ts';
import { searchGames } from '#lib/igdb.ts';

export const igdbRouter = router({
  search: protectedProcedure
    .input(z.object({ searchString: z.string() }))
    .query(async ({ input, ctx }) => {
      const accessToken = await getTwitchAccessToken(ctx.userId);

      if (accessToken.error) {
        throw new TRPCError({
          message: 'Twitch account was not found',
          code: 'UNAUTHORIZED',
          cause: accessToken.error,
        });
      }

      const gamesSearchResult = await searchGames(
        input.searchString,
        envServer.TWITCH_CLIENT_ID,
        accessToken.data,
      );
      if (gamesSearchResult.data) {
        return gamesSearchResult.data;
      } else {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Error while fetching from IGDB',
          cause: gamesSearchResult.error,
        });
      }
    }),
});
