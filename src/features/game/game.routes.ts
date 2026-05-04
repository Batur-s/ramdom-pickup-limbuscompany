// features/game/game.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { gamesController } from './game.controllers';

export const gamesRouter = Router();

gamesRouter.post('/', requireAuth, gamesController.createGame);
gamesRouter.get('/:gameId/deck', requireAuth, gamesController.getGameDeck);
gamesRouter.post('/:gameId/reroll', requireAuth, gamesController.createReroll);
gamesRouter.patch('/:gameId/:rerollId/apply', requireAuth, gamesController.updateReroll);
gamesRouter.get('/:gameId/stages', requireAuth, gamesController.getAvailableStages);
gamesRouter.post('/:gameId/stages', requireAuth, gamesController.updateStages);
gamesRouter.patch('/:gameId/advance', requireAuth, gamesController.advanceStage);
gamesRouter.patch('/:gameId/status', requireAuth, gamesController.changeStatus);
gamesRouter.get('/:gameId/summary', requireAuth, gamesController.summaryGames);