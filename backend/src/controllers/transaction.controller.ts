import { Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
  static async create(req: any, res: Response) {
    try {
      const transaction = await TransactionService.create(req.userId, req.body);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async list(req: any, res: Response) {
    try {
      const transactions = await TransactionService.list(req.userId);
      res.json(transactions);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
