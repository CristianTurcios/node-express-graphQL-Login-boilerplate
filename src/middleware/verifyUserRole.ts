import { NextFunction, Request, Response } from 'express';
import Account from '../models/User';

export default (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const { id, role } = res.locals.jwtPayload.user;
  const user = await Account.findById(id);

  if (!user) { return res.status(401).send(); }

  if (roles.indexOf(user.role) === -1 || user.role !== role) {
    return res.status(401).send();
  }
  return next();
};
