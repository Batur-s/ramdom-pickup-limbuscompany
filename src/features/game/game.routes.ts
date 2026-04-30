// features/game/game.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { gamesController } from './game.controllers';

export const gamesRouter = Router();

gamesRouter.post('/', requireAuth, gamesController.createGame);
gamesRouter.get('/:gameId/deck', requireAuth, gamesController.getGameDeck);
gamesRouter.post('/:gameId/reroll', requireAuth, gamesController.createReroll);
gamesRouter.patch('/:gameId/:rerollId/apply', requireAuth, gamesController.updateReroll);
gamesRouter.post('/:gameId/advance', requireAuth, gamesController.advanceGame);
