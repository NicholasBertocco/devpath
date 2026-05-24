import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const authorizeRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Acesso negado. Você não tem permissão para esta ação.' });
      return;
    }
    next();
  };
};
