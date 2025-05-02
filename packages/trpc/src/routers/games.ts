import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { game } from '@where-are-my-games/db/schema';

import { protectedProcedure, router } from '#init.ts';
import { igdbGame } from './igdb';

export const gamesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.game.findMany({
      where: { users: { id: ctx.session.user.id } },
    });
  }),
  add: protectedProcedure.input(igdbGame).query(async ({ ctx, input }) => {
    // Fetch game from igdb instead
    await ctx.db
      .insert(game)
      .values({ ...input, firstReleaseDate: new Date(input.firstReleaseDate) });
  }),
  delete: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      await ctx.db.delete(game).where(eq(game.id, input.gameId));
    }),
});
