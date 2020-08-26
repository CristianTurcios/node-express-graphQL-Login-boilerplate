import * as Joi from 'joi';

export const loginValidation = (data: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
  });
  return schema.validate(data);
};

export const registerValidation = (data: object) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(100).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    acceptTerms: Joi.boolean().valid(true).required(),
    role: Joi.string().required(),
  });
  return schema.validate(data);
};

export const verifyEmailValidation = (data: object) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  return schema.validate(data);
};

export const forgotPasswordValidation = (data: object) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

export const validateResetTokenValidation = (data: object) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  return schema.validate(data);
};

export const revokeTokenValidation = (data: object) => {
  const schema = Joi.object({
    token: Joi.string().required(),
  });
  return schema.validate(data);
};

export const changePasswordValidation = (data: object) => {
  // Also we can apply regex to validate the strong of the password :|
  const schema = Joi.object({
    password: Joi.string().min(6).max(100).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
    token: Joi.string().required(),
  });
  return schema.validate(data);
};
