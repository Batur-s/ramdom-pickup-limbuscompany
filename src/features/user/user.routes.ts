// routes/me.ts
import { Router } from 'express';
import { meController } from './user.controllers';
import { requireAuth } from '../middlewares/requireAuth';

export const meRouter = Router();

meRouter.get('/', requireAuth, meController.getMe);
