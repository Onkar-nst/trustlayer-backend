import { Request, Response, NextFunction } from 'express';
import { identityService, disputeService, userService, trustScoreService } from '../services';

export class AdminController {
  async getPendingIdentities(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await identityService.getAllPending();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async approveIdentity(req: any, res: Response, next: NextFunction) {
    try {
      const result = await identityService.approve(req.params.id, req.user.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async rejectIdentity(req: any, res: Response, next: NextFunction) {
    try {
      const result = await identityService.reject(req.params.id, req.user.id, req.body.reason);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getDisputes(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await disputeService.getAll();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async resolveDispute(req: any, res: Response, next: NextFunction) {
    try {
      const result = await disputeService.resolve(req.params.id, req.user.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { skip, take } = req.query;
      const result = await userService.getAll(Number(skip) || 0, Number(take) || 20);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll(0, 1000);
      const pendingIdentities = await identityService.getAllPending();
      const openDisputes = await disputeService.getAll();

      res.json({
        totalUsers: users.length,
        pendingVerifications: pendingIdentities.length,
        openDisputes: openDisputes.length,
        averageTrustScore: users.reduce((acc, u) => acc + (u.trustScore?.total || 0), 0) / (users.length || 1)
      });
    } catch (err) {
      next(err);
    }
  }
}
