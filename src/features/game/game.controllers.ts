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

  async getGameDeck(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const gameId = req.params.gameId as string;

    const deck = await gamesService.getGameDeckByGameId({
      userId,
      gameId,
    });

    return res.json({ items: deck });
  },

  async createReroll(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const gameIdParam = req.params.gameId;
    const gameId = Array.isArray(gameIdParam) ? gameIdParam[0] : gameIdParam;

    if (!gameId) return res.status(400).json({ message: 'gameId is required' });

    const result = await gamesService.createRerollForGame({
      userId,
      gameId,
    });

    return res.status(201).json(result);
  },

  async updateReroll(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);

    const gameIdParam = req.params.gameId;
    const gameId = Array.isArray(gameIdParam) ? gameIdParam[0] : gameIdParam;

    const rerollIdParam = req.params.rerollId;
    const rerollId = Array.isArray(rerollIdParam) ? rerollIdParam[0] : rerollIdParam;

    const selectUserIdentityIdParam = req.body.selectUserIdentityId;
    const selectUserIdentityId = Array.isArray(selectUserIdentityIdParam)
      ? selectUserIdentityIdParam[0]
      : selectUserIdentityIdParam;

    if (!userId || !gameId || !rerollId || !selectUserIdentityId)
      return res.status(400).json({ message: 'No data' });

    const result = await gamesService.updateRerollForGame({
      userId,
      gameId,
      rerollId,
      selectUserIdentityId,
    });

    return res.status(201).json(result);
  },
};
