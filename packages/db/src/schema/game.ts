import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { user } from './auth';

export const game = pgTable(
  'game',
  {
    id: integer().primaryKey(),
    name: text().notNull(),
    cover: text().notNull(),
    firstReleaseDate: timestamp().notNull(),
    genres: jsonb().$type<string[]>().notNull(),
    slug: text().notNull(),
    summary: text().notNull(),
  },
  (table) => [index('name_idx').on(table.name)],
);

export const userToGame = pgTable(
  'user_to_game',
  {
    userId: text()
      .notNull()
      .references(() => user.id),
    gameId: integer()
      .notNull()
      .references(() => game.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.gameId] })],
);

export const gamePlatformEnum = pgEnum('game_platform_enum', [
  'xbox',
  'switch',
  'ps',
  'steam',
  'egs',
  'gog',
  'uplay',
  'origins',
  'msstore',
]);

export const gamePlatform = pgTable(
  'game_platform',
  {
    gameId: integer()
      .notNull()
      .references(() => game.id),
    platform: gamePlatformEnum().notNull(),
  },
  (table) => [primaryKey({ columns: [table.gameId, table.platform] })],
);
