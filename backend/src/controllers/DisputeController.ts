import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { disputeService } from '../services';

export const createDisputeSchema = z.object({
  body: z.object({
    targetReviewId: z.string().uuid().optional(),
    targetTransactionId: z.string().uuid().optional(),
    reason: z.string().min(10),
    evidenceText: z.string().optional(),
  }),
});

export class DisputeController {
  async create(req: any, res: Response, next: NextFunction) {
    try {
      const result = await disputeService.create({
        ...req.body,
        raisedById: req.user.id,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: any, res: Response, next: NextFunction) {
    try {
      const result = await disputeService.getByUser(req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
