import Account from '../models/User';
import { sendVerificationEmail } from '../helpers/email';
import { hashPassword, randomTokenString } from '../helpers/helpers';
import { registerValidation } from '../controllers/validations/authValidations';

export default async () => {
  const users = await Account.find();
  return users;
};

export const getUserById = async (parent: any, args: any) => {
  const user = await Account.findById(args.id) || null;

  if (!user) { throw new Error('User not found'); }
  return user;
};

export const postUser = async (parent: any, args: any) => {
  const newArgs = { ...args };
  if (newArgs.token.user.role !== 'Admin') { throw new Error('UNAUTHORIZED'); }

  delete newArgs.token;

  const { error } = registerValidation(newArgs);
  if (error) { throw new Error(error.details[0].message); }

  const { email, password } = newArgs;
  if (await Account.findOne({ email })) { throw new Error('User already exists'); }

  const origin = `${process.env.API_URL}:${process.env.PORT}` || '';
  const account = new Account(newArgs);
  account.verificationToken = randomTokenString();
  account.password = hashPassword(password);

  await account.save();

  await sendVerificationEmail(account, origin);
  return account;
};

export const updateUser = async (parent: any, args: any) => {
  if (args.token.user.role !== 'Admin') { throw new Error('UNAUTHORIZED'); }
  const user = await Account.findById(args.id);

  if (!user) { throw new Error('User not found'); }

  if (user.email !== args.email && await Account.findOne({ email: args.email })) {
    throw new Error('email already taken');
  }

  Object.assign(user, args);
  user.updatedAt = Date.now();
  await user.save();
  return user;
};

export const deleteUser = async (parent: any, args: any) => {
  if (args.token.user.role !== 'Admin') { throw new Error('UNAUTHORIZED'); }
  const user = await Account.findById(args.id);
  if (!user) { throw new Error('User not found'); }
  await user.remove();
  return user;
};
