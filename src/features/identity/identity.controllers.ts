// controllers/meIdentitiesController.ts
import { Request, Response } from 'express';
import { meIdentitiesService } from './identity.service';
import { getUserIdOrNull } from '../utils/getUserId';
import { meIdentitiesRepository } from './identity.repositories';

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

  async getAll(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const items = await meIdentitiesService.getAllIdentities();
    return res.json({ items });
  },

  async deleteIdentity(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const userIdentityId = req.params.userIdentityId as string;
    if (!userIdentityId) return res.status(400).json({ message: 'userIdentityId is required' });

    await meIdentitiesService.deleteIdentity(userId, userIdentityId);
    return res.status(200).end();
  },
};
