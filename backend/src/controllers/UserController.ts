import { Request, Response } from 'express';
import { userService } from '../services';

export class UserController {
  async getProfile(req: Request, res: Response) {
    const result = await userService.getProfile(req.params.id);
    res.json(result);
  }

  async search(req: Request, res: Response) {
    const result = await userService.search(req.query.q as string);
    res.json(result);
  }
}
