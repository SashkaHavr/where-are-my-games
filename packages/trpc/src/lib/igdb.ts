import igdb from 'igdb-api-node';
import z from 'zod';

import { tryCatch, tryCatchSync, TwitchError } from '#utils/error.ts';

interface IGDBGame {
  id: number;
  name: string;
  cover: {
    id: number;
    image_id: string;
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

const igdbGame = z.object({
  id: z.number().nonnegative(),
  name: z.string().nonempty(),
  cover: z
    .object({ image_id: z.string() })
    .transform((cover) => cover.image_id),
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

function parseGame(game: IGDBGame | undefined) {
  if (!game) {
    throw new TwitchError({ message: 'Game data is undefined' });
  }
  return igdbGame.parse({
    firstReleaseDate: game.first_release_date,
    ...game,
  });
}

const gameFields = [
  'cover.image_id',
  'first_release_date',
  'name',
  'slug',
  'summary',
  'genres.name',
];

export async function searchGames(
  searchString: string,
  twitchClientId: string,
  twitchAccessToken: string,
) {
  const result = await tryCatch<IGDBResponse>(
    igdb(twitchClientId, twitchAccessToken)
      .fields(gameFields)
      .limit(50)
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
    throw new TwitchError({
      message: 'Failed to fetch games from IGDB',
      cause: result.error,
    });
  }
  const games = result.data.data;
  if (!Array.isArray(games)) {
    throw new TwitchError({ message: 'Expected array response from IGDB' });
  }

  const parsedGames = tryCatchSync(() => games.map((game) => parseGame(game)));
  if (parsedGames.error) {
    throw new TwitchError({
      message: 'Failed to parse games from IGDB',
      cause: parsedGames.error,
    });
  }
  return parsedGames.data;
}

export async function getGame(
  gameId: number,
  twitchClientId: string,
  twitchAccessToken: string,
) {
  const result = await tryCatch<IGDBResponse>(
    igdb(twitchClientId, twitchAccessToken)
      .fields(gameFields)
      .limit(1)
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
    throw new TwitchError({
      message: 'Failed to fetch game from IGDB',
      cause: result.error,
    });
  }
  if (!Array.isArray(result.data.data) || result.data.data[0] == undefined) {
    throw new TwitchError({
      message: 'Game with given id was not found: ' + gameId,
    });
  }
  const game = tryCatchSync(() => parseGame(result.data.data[0]));
  if (game.error) {
    throw new TwitchError({
      message: 'Failed to parse game from IGDB',
      cause: game.error,
    });
  }
  return game.data;
}
