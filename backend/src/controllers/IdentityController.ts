import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { identityService } from '../services';

export const identityUploadSchema = z.object({
  body: z.object({
    documentType: z.enum(['GOVT_ID', 'PASSPORT', 'DRIVING_LICENSE']),
    documentUrl: z.string(),
  }),
});

export class IdentityController {
  async upload(req: any, res: Response, next: NextFunction) {
    try {
      const result = await identityService.upload(req.user.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getStatus(req: any, res: Response, next: NextFunction) {
    try {
      const result = await identityService.getStatus(req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
