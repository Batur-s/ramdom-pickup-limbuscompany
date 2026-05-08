// features/sinners/sinners.controller.ts
import { Request, Response } from 'express';
import prisma from '../../lib/prisma';

export const sinnersController = {
  async getSinners(req: Request, res: Response) {
    const sinners = await prisma.sinners.findMany({
      select: { id: true, name: true, imageUrl: true },
    });

    sinners.sort((a, b) => {
      const numA = parseInt(a.id.replace('sinner-', ''));
      const numB = parseInt(b.id.replace('sinner-', ''));
      return numA - numB;
    });

    return res.json({ items: sinners });
  },
};
