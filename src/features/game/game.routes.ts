// features/game/game.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { gamesController } from './game.controllers';

export const gamesRouter = Router();

gamesRouter.post('/', requireAuth, gamesController.createGame);
