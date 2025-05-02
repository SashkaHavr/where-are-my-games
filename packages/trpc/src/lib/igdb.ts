import igdb from 'igdb-api-node';
import z from 'zod';

import { err, ok, tryCatchPromise } from '@where-are-my-games/utils';

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

interface IGDBResponse {
  data: IGDBGame[];
}

interface IGDBError {
  response: { data: object };
}

export const igdbGame = z.object({
  id: z.number().nonnegative(),
  name: z.string().nonempty(),
  cover: z.url(),
  firstReleaseDate: z.number().nonnegative(),
  genres: z.array(z.string()),
  slug: z.string(),
  summary: z.string(),
});

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

  return ok(
    result.data.data
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
  if (result.data.data.length != 1) {
    return err({ message: 'Game with given id was not found', gameId: gameId });
  }
  const game = igdbGame.safeParse(result.data.data[0]);
  if (game.error) {
    return err(game.error);
  }
  return ok(game.data);
}
