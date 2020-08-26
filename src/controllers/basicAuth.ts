import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import RefreshToken from '../models/RefreshToken';
import Account, { UserInterface } from '../models/User';
import { sendVerificationEmail, sendPasswordResetEmail } from '../helpers/email';

import {
  hashPassword,
  setTokenCookie,
  generateJwtToken,
  randomTokenString,
} from '../helpers/helpers';

import {
  loginValidation,
  registerValidation,
  verifyEmailValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  validateResetTokenValidation,
} from './validations/authValidations';

const generateRefreshToken = (user: UserInterface, ipAddress: string) => new RefreshToken({
  account: user.id,
  createdByIp: ipAddress,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  token: randomTokenString(),
  revoked: false,
});

export const test = async (request: Request, response: Response) => response.status(200).send({ message: 'hola' });

export const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token }).populate('account');
  if (!refreshToken || !refreshToken.isActive) { return null; }

  return refreshToken;
};

export const login = async (request: Request, response: Response) => {
  const { error } = loginValidation(request.body);
  if (error) { return response.status(400).send({ error: error.details[0].message }); }

  const { email, password } = request.body;
  const user = await Account.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return response.status(401).send();
  }

  const token = generateJwtToken(user, process.env.JWT_SECRET || '');
  const refreshToken = generateRefreshToken(user, request.ip);
  await refreshToken.save();
  const cookieOptions = setTokenCookie();
  response.cookie('token', token, cookieOptions);
  response.cookie('refreshToken', refreshToken.token, cookieOptions);
  return response.status(200).send({ token, refreshToken: refreshToken.token });
};

export const forgotPassword = async (request: Request, response: Response) => {
  const { error } = forgotPasswordValidation(request.body);
  if (error) { return response.status(400).send({ error: error.details[0].message }); }

  const { email } = request.body;
  const user = await Account.findOne({ email });
  if (!user) { return response.status(400).send({ error: 'user not found' }); }

  user.resetToken = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    token: randomTokenString(),
  };
  await user.save();
  await sendPasswordResetEmail(user);
  return response.send({ success: 'Please check your email for password reset instructions' });
};

export const register = async (request: Request, response: Response) => {
  const { error } = registerValidation(request.body);
  if (error) { return response.status(400).send({ error: error.details[0].message }); }

  const { email, password } = request.body;
  if (await Account.findOne({ email })) { return response.status(409).send({ error: 'user already exists' }); }

  const account = new Account(request.body);
  account.verificationToken = randomTokenString();
  account.password = hashPassword(password);

  await account.save();

  await sendVerificationEmail(account);
  return response.status(200).send({ success: 'Registration successful, please check your email for verification instructions' });
};

export const validateResetToken = async (request: Request, response: Response) => {
  const { error } = validateResetTokenValidation(request.body);
  if (error) { return response.status(400).send({ error: error.details[0].message }); }

  const { token } = request.body;
  const account = await Account.findOne({
    'resetToken.token': token,
    'resetToken.expires': { $gt: Date.now() },
  });

  if (!account) { return response.status(400).send({ error: 'Invalid token' }); }
  return response.status(204).send();
};

export const refreshToken = async (request: Request, response: Response) => {
  if (!('refreshToken' in request.cookies)) {
    return response.status(404).send({ error: 'token was not provided' });
  }

  const token = request.cookies.refreshToken;
  const ipAddress = request.ip;
  const refreshTokenVar = await getRefreshToken(token);

  if (!refreshTokenVar) { return response.status(404).send({ error: 'Verification failed' }); }

  const { account } = refreshTokenVar;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(account, ipAddress);
  refreshTokenVar.revoked = Date.now();
  refreshTokenVar.revokedByIp = ipAddress;
  refreshTokenVar.replacedByToken = newRefreshToken.token;
  await refreshTokenVar.save();
  await newRefreshToken.save();

  const jwtToken = generateJwtToken(account, process.env.JWT_SECRET || '');
  const cookieOptions = setTokenCookie();
  response.cookie('token', jwtToken, cookieOptions);
  response.cookie('refreshToken', newRefreshToken.token, cookieOptions);
  return response.status(200).send({ token: jwtToken, refreshToken: newRefreshToken.token });
};

export const verifyEmail = async (request: Request, response: Response) => {
  const { token } = request.query;
  const { error } = verifyEmailValidation({ token });

  if (error) { return response.status(400).send({ error: error.details[0].message }); }
  const user = await Account.findOne({ verificationToken: token?.toString() });
  if (!user) { return response.status(404).send({ error: 'Invalid Token' }); }

  user.verified = Date.now();
  user.verificationToken = '';
  await user.save();
  return response.status(204).send();
};

export const changePassword = async (request: Request, response: Response) => {
  const { token, password } = request.body;
  const { error } = changePasswordValidation(request.body);

  if (error) {
    return response.status(400).send({ error: error.details[0].message });
  }

  const user = await Account.findOne({
    'resetToken.expires': { $gt: Date.now() },
    'resetToken.token': token,
  });

  if (!user) {
    return response.status(401).send({ error: 'Invalid token' });
  }

  user.password = hashPassword(password);
  user.passwordReset = Date.now();
  user.resetToken = undefined || { token: '', expires: new Date() };
  await user.save();
  return response.status(204).send();
};
