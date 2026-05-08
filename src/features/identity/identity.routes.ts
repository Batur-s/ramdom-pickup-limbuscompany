// routes/meIdentities.ts
import { Router } from 'express';
import { requireAuth } from '../middlewares/requireAuth';
import { meIdentitiesController } from './identity.controllers';

export const meIdentitiesRouter = Router();

meIdentitiesRouter.get('/', requireAuth, meIdentitiesController.getMeIdentities);
meIdentitiesRouter.post('/', requireAuth, meIdentitiesController.postIdentities);
meIdentitiesRouter.get('/all', requireAuth, meIdentitiesController.getAll);
meIdentitiesRouter.delete('/:userIdentityId', requireAuth, meIdentitiesController.deleteIdentity);
meIdentitiesRouter.patch('/:userIdentityId/sync-grade', requireAuth, meIdentitiesController.updateSyncGrade);