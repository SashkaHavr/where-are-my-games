import { defineRelations } from 'drizzle-orm';

import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
  user: {
    games: r.many.game({
      from: r.user.id.through(r.userToGame.userId),
      to: r.game.id.through(r.userToGame.gameId),
    }),
  },
  game: {
    users: r.many.user(),
    userGames: r.many.userToGame({ from: r.game.id, to: r.userToGame.gameId }),
  },
}));
