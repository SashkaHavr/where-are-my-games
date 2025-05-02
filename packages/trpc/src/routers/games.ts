import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@where-are-my-games/db';
import { game } from '@where-are-my-games/db/schema';
import { envServer } from '@where-are-my-games/env/server';

import { protectedProcedure, router } from '#init.ts';
import { getTwitchAccessToken } from '#lib/getTwitchAccessToken.ts';
import { getGame } from '#lib/igdb.ts';

export const gamesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return db.query.game.findMany({
      where: { users: { id: ctx.userId } },
    });
  }),
  add: protectedProcedure
    .input(z.object({ igdbGameId: z.number() }))
    .query(async ({ ctx, input }) => {
      const accessToken = await getTwitchAccessToken(ctx.userId);
      if (accessToken.error) {
        throw new TRPCError({
          message: 'Twitch account was not found',
          code: 'UNAUTHORIZED',
          cause: accessToken.error,
        });
      }
      const game = await getGame(
        input.igdbGameId,
        envServer.TWITCH_CLIENT_ID,
        accessToken.data,
      );
      if (game.error) {
        throw new TRPCError({
          code: 'BAD_GATEWAY',
          message: 'Error while fetching from IGDB',
          cause: game.error,
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ input }) => {
      await db.delete(game).where(eq(game.id, input.gameId));
    }),

  // Game platforms
});
