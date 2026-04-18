import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { transactionService } from '../services';

export const createTransactionSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid(),
    amount: z.number().positive(),
    currency: z.string().default('USD'),
    type: z.enum(['PAYMENT', 'REFUND', 'ESCROW', 'TRANSFER']),
    description: z.string().optional(),
  }),
});

export class TransactionController {
  async create(req: any, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.create({
        ...req.body,
        senderId: req.user.id,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: any, res: Response, next: NextFunction) {
    try {
      const { skip, take } = req.query;
      const result = await transactionService.getByUser(req.user.id, Number(skip) || 0, Number(take) || 10);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.getById(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.complete(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async fail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await transactionService.fail(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
