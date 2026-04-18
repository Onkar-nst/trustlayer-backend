import { Request, Response } from 'express';
import { trustScoreService } from '../services';

export class TrustScoreController {
  async getBreakdown(req: Request, res: Response) {
    const result = await trustScoreService.getBreakdown(req.params.userId);
    res.json(result);
  }

  async recalculate(req: Request, res: Response) {
    const result = await trustScoreService.recalculate(req.body.userId);
    res.json(result);
  }
}
