import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[ErrorHandler]', err);

  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred';
  const errorType = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(status).json({
    error: errorType,
    message: message,
  });
};
