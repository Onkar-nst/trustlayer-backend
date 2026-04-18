import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { reviewService } from '../services';

export const createReviewSchema = z.object({
  body: z.object({
    subjectId: z.string().uuid(),
    transactionId: z.string().uuid(),
    rating: z.number().min(1).max(5),
    body: z.string().min(5),
    isAnonymous: z.boolean().optional(),
  }),
});

export class ReviewController {
  async create(req: any, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.create({
        ...req.body,
        authorId: req.user.id,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: any, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.getByUser(req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getGiven(req: any, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.getGiven(req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req: any, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.update(req.params.id, req.user.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: any, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
