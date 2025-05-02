import igdb from 'igdb-api-node';
import z from 'zod';

import { err, ok, tryCatchPromise } from '@where-are-my-games/utils';

export const igdbGame = z.object({
  id: z.number().nonnegative(),
  name: z.string().nonempty(),
  cover: z
    .object({ url: z.string() })
    .transform((cover) => 'https:' + cover.url),
  firstReleaseDate: z
    .number()
    .nonnegative()
    .transform((timestamp) => new Date(timestamp)),
  genres: z
    .array(z.object({ name: z.string() }))
    .transform((genres) => genres.map((g) => g.name)),
  slug: z.string(),
  summary: z.string(),
});

interface IGDBResponse {
  data: { data: unknown };
}

interface IGDBError {
  response: { data: object };
}

export async function searchGames(
  searchString: string,
  twitchClientId: string,
  twitchAccessToken: string,
) {
  const result = await tryCatchPromise<IGDBResponse, IGDBError>(
    igdb(twitchClientId, twitchAccessToken)
      .fields([
        'cover.url',
        'first_release_date',
        'name',
        'slug',
        'summary',
        'genres.name',
      ])
      .limit(10)
      .search(searchString)
      .where([
        'cover != n',
        'genres != n',
        'first_release_date != n',
        'summary != n',
      ])
      .request('/games'),
  );
  if (result.error) {
    return err(result.error.response.data);
  }
  const games = result.data.data;
  if (!Array.isArray(games)) {
    return err('Expected array response from IGDB');
  }

  return ok(
    games
      .map((game) => igdbGame.safeParse(game))
      .filter((game) => game.success)
      .map((game) => game.data),
  );
}

export async function getGame(
  gameId: number,
  twitchClientId: string,
  twitchAccessToken: string,
) {
  const result = await tryCatchPromise<IGDBResponse, IGDBError>(
    igdb(twitchClientId, twitchAccessToken)
      .fields([
        'cover.url',
        'first_release_date',
        'name',
        'slug',
        'summary',
        'genres.name',
      ])
      .limit(10)
      .where([
        `id = ${gameId}`,
        'cover != n',
        'genres != n',
        'first_release_date != n',
        'summary != n',
      ])
      .request('/games'),
  );
  if (result.error) {
    return err(result.error.response.data);
  }
  if (!Array.isArray(result.data.data) || result.data.data.length != 1) {
    return err({ message: 'Game with given id was not found', gameId: gameId });
  }
  const game = igdbGame.safeParse(result.data.data[0]);
  if (game.error) {
    return err(game.error);
  }
  return ok(game.data);
}
