import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services';

export class AuditController {
  async getMe(req: any, res: Response, next: NextFunction) {
    try {
      const result = await auditService.getByUser(req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await auditService.getAll();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
