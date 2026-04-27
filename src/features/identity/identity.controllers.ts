// controllers/meIdentitiesController.ts
import { Request, Response } from 'express';
import { meIdentitiesService } from './identity.service';
import { getUserIdOrNull } from '../utils/getUserId';

export const meIdentitiesController = {
  async getMeIdentities(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const list = await meIdentitiesService.getMeIdentities(userId);
    return res.json({ items: list });
  },

  async postIdentities(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const { identityIds } = req.body;
    await meIdentitiesService.postIdentities(userId, identityIds);
    return res.status(201).end();
  },
};
