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
      return await searchGames(
        input.searchString,
        envServer.TWITCH_CLIENT_ID,
        accessToken,
      );
    }),
});
