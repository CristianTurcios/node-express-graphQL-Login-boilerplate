import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization as string;
  let jwtPayload;

  try {
    const splittedToken = token.split(' ').pop() || '';
    const secret = process.env.JWT_SECRET || '';
    jwtPayload = jwt.verify(splittedToken, secret) as any;
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    res.status(401).send();
    return;
  }
  next();
};

export const verifyTokenGraphql = async (req: Request) => {
  const token = req.headers.authorization as string;
  let jwtPayload;

  try {
    const splittedToken = token.split(' ').pop() || '';
    const secret = process.env.JWT_SECRET || '';
    jwtPayload = jwt.verify(splittedToken, secret) as any;
    return jwtPayload;
  } catch (error) {
    return false;
  }
};
