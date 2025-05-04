import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@where-are-my-games/db';
import {
  game,
  gamePlatform,
  gamePlatformEnum,
  userToGame,
} from '@where-are-my-games/db/schema';
import { envServer } from '@where-are-my-games/env/server';

import { protectedProcedure, router } from '#init.ts';
import { getTwitchAccessToken } from '#lib/getTwitchAccessToken.ts';
import { getGame } from '#lib/igdb.ts';

const gamePlatformEnumSchema = z.enum(gamePlatformEnum.enumValues);

const gamePlatformSchema = z.object({
  platform: gamePlatformEnumSchema,
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

export const gamesRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return db.query.game.findMany({
      where: { users: { id: ctx.userId } },
      with: { platforms: true },
    });
  }),
  add: protectedProcedure
    .input(
      z.object({
        igdbGameId: z.number(),
        platforms: z.array(gamePlatformSchema).nonempty().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const game = await getExistingGameOrFromIGDB(
        ctx.userId,
        input.igdbGameId,
      );
      if (game) {
        await db
          .insert(userToGame)
          .values({ userId: ctx.userId, gameId: game.id });
        if (input.platforms) {
          await db.insert(gamePlatform).values(
            input.platforms.map((p) => ({
              ...p,
              gameId: game.id,
            })),
          );
        }
      }
    }),
  delete: protectedProcedure
    .input(z.object({ gameId: z.number() }))
    .mutation(async ({ input }) => {
      await db.delete(game).where(eq(game.id, input.gameId));
    }),
  addPlatform: protectedProcedure
    .input(z.object({ gameId: z.number(), platform: gamePlatformSchema }))
    .mutation(async ({ input }) => {
      const dbGame = await db.query.game.findFirst({
        where: { id: input.gameId },
      });
      if (!dbGame) {
        throw new TRPCError({
          message: 'Game not found',
          code: 'UNPROCESSABLE_CONTENT',
          cause: input,
        });
      }
      await db
        .insert(gamePlatform)
        .values({ ...input.platform, gameId: input.gameId });
    }),
  deletePlatform: protectedProcedure
    .input(z.object({ gameId: z.number(), platform: gamePlatformEnumSchema }))
    .mutation(async ({ input }) => {
      const dbPlatform = await db.query.gamePlatform.findFirst({
        where: { gameId: input.gameId, platform: input.platform },
      });
      if (!dbPlatform) {
        throw new TRPCError({
          message: 'Game platform not found',
          code: 'UNPROCESSABLE_CONTENT',
          cause: input,
        });
      }
      await db
        .delete(gamePlatform)
        .where(
          and(
            eq(gamePlatform.gameId, input.gameId),
            eq(gamePlatform.platform, input.platform),
          ),
        );
    }),
  setPlatforms: protectedProcedure
    .input(
      z.object({ gameId: z.number(), platforms: z.array(gamePlatformSchema) }),
    )
    .mutation(async ({ input }) => {
      const dbGame = await db.query.game.findFirst({
        where: { id: input.gameId },
      });
      if (!dbGame) {
        throw new TRPCError({
          message: 'Game not found',
          code: 'UNPROCESSABLE_CONTENT',
          cause: input,
        });
      }
      await db
        .delete(gamePlatform)
        .where(and(eq(gamePlatform.gameId, input.gameId)));
      await db.insert(gamePlatform).values(
        input.platforms.map((platform) => ({
          ...platform,
          gameId: input.gameId,
        })),
      );
    }),
});
