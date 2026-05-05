// features/sinners/sinners.routes.ts
import { Router } from 'express';
import { sinnersController } from './sinner.controller';

export const sinnersRouter = Router();

sinnersRouter.get('/', sinnersController.getSinners);