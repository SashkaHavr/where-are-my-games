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
  getAll: protectedProcedure
    .output(
      z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          cover: z.string(),
          platforms: z.array(z.enum(gamePlatforms)),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      const games = await db.query.game.findMany({
        where: { userGames: { userId: ctx.userId } },
        with: {
          userGames: {
            columns: { platforms: true, createdAt: true },
          },
        },
      });
      return games
        .map((game) => {
          return {
            ...game,
            platforms: game.userGames[0]!.platforms,
          };
        })
        .toSorted(
          (a, b) =>
            a.userGames[0]!.createdAt.valueOf() -
            b.userGames[0]!.createdAt.valueOf(),
        );
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

  const newGame = await getGame(
    gameId,
    envServer.TWITCH_CLIENT_ID,
    accessToken,
  );
  return (await db.insert(game).values(newGame).returning({ id: game.id }))[0];
}
