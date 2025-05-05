import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@where-are-my-games/db';
import { game, gamePlatforms, userToGame } from '@where-are-my-games/db/schema';
import { envServer } from '@where-are-my-games/env/server';

import { protectedProcedure, router } from '#init.ts';
import { getTwitchAccessToken } from '#lib/getTwitchAccessToken.ts';
import { getGame } from '#lib/igdb.ts';

export const gamesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const games = await db.query.game.findMany({
      where: { userGames: { userId: ctx.userId } },
    });
    return games.map((game) => ({
      ...game,
    }));
  }),
  getPlatforms: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userGame = await db.query.userToGame.findFirst({
        where: { userId: ctx.userId, gameId: input.gameId },
      });
      if (!userGame) {
        throw new TRPCError({
          message: 'Game not found',
          code: 'UNPROCESSABLE_CONTENT',
          cause: input,
        });
      }
      return userGame.platforms;
    }),
  add: protectedProcedure
    .input(
      z.object({
        game: z.object({
          id: z.number().nonnegative(),
          name: z.string().nonempty(),
          cover: z.string(),
          firstReleaseDate: z.date(),
          genres: z.array(z.string()),
          slug: z.string(),
          summary: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const game = await getExistingGameOrFromIGDB(ctx.userId, input.game.id);
      if (game) {
        const userGame = await db.query.userToGame.findFirst({
          where: { userId: ctx.userId, gameId: input.game.id },
        });
        if (userGame) {
          throw new TRPCError({
            message: 'Duplicate game',
            code: 'UNPROCESSABLE_CONTENT',
            cause: input,
          });
        }
        await db
          .insert(userToGame)
          .values({ userId: ctx.userId, gameId: game.id });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(userToGame)
        .where(
          and(
            eq(userToGame.gameId, input.gameId),
            eq(userToGame.userId, ctx.userId),
          ),
        );
    }),
  setPlatforms: protectedProcedure
    .input(
      z.object({
        gameId: z.number(),
        platforms: z.array(z.enum(gamePlatforms)),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const dbGame = await db.query.game.findFirst({
        where: { id: input.gameId, users: { id: ctx.userId } },
      });
      if (!dbGame) {
        throw new TRPCError({
          message: 'Game not found',
          code: 'UNPROCESSABLE_CONTENT',
          cause: input,
        });
      }
      await db
        .update(userToGame)
        .set({ platforms: input.platforms })
        .where(
          and(
            eq(userToGame.gameId, input.gameId),
            eq(userToGame.userId, ctx.userId),
          ),
        );
    }),
});

async function getExistingGameOrFromIGDB(userId: string, gameId: number) {
  const existingGame = await db.query.game.findFirst({
    columns: { id: true },
    where: { id: gameId },
  });
  if (existingGame) return existingGame;

  const accessToken = await getTwitchAccessToken(userId);
  if (accessToken.error) {
    throw new TRPCError({
      message: 'Twitch account was not found',
      code: 'UNAUTHORIZED',
      cause: accessToken.error,
    });
  }
  const newGame = await getGame(
    gameId,
    envServer.TWITCH_CLIENT_ID,
    accessToken.data,
  );
  if (newGame.error != undefined) {
    throw new TRPCError({
      code: 'BAD_GATEWAY',
      message: 'Error while fetching from IGDB',
      cause: newGame.error,
    });
  }
  return (
    await db.insert(game).values(newGame.data).returning({ id: game.id })
  )[0];
}
