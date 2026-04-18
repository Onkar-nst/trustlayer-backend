import { Response } from 'express';
import { IdentityService } from '../services/identity.service';

export class IdentityController {
  static async submit(req: any, res: Response) {
    try {
      const verification = await IdentityService.submit(req.userId, req.body);
      res.status(201).json(verification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getStatus(req: any, res: Response) {
    try {
      const status = await IdentityService.getStatus(req.userId);
      res.json(status);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
