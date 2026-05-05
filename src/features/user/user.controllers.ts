// controllers/meController.ts
import { Request, Response } from 'express';
import { meService } from './user.services';
import { getUserIdOrNull } from '../utils/getUserId';

export const meController = {
  async getMe(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const me = await meService.getMe(userId);
    return res.json(me);
  },

  async updateMe(req: Request, res: Response) {
    const userId = getUserIdOrNull(req);
    if (!userId) return res.status(401).json({ message: 'Not authenticated' });

    const { nickName } = req.body;
    const result = await meService.updateNickName(userId, nickName);
    return res.json(result);
  },
};
