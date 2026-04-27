// features/game/game.controllers.ts
import { Request, Response } from 'express';
import { gamesService } from './game.services';
import { getUserIdOrNull } from '../utils/getUserId';

export const gamesController = {
  async createGame(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const { title, deck } = req.body as {
      title?: string;
      deck: { sinnerId: string; userIdentityId: string }[];
    };

    const result = await gamesService.createGame({
      userId,
      title,
      deck,
    });

    return res.status(201).json(result);
  },
};
