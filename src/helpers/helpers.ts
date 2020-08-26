import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserInterface } from '../models/User';

export const generateJwtToken = (user: UserInterface, jwtSecret: string) => jwt.sign({
  user: {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  },
}, jwtSecret, { expiresIn: '8h' });

export const randomTokenString = () => crypto.randomBytes(40).toString('hex');

export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);

export const setTokenCookie = () => {
  // create cookie that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  return cookieOptions;
};
