import { UserInterface } from '../models/User';

const sgMail = require('@sendgrid/mail');

const sendEmail = async (data: any) => {
  const apiKey = process.env.SENDGRID_API_KEY || '';

  sgMail.setApiKey(apiKey);
  const msg = {
    to: data.to,
    from: process.env.SENDGRID_EMAIL_FROM || '',
    subject: data.subject,
    html: data.html,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error('error', error);
  }
};

export const sendPasswordResetEmail = async (user: UserInterface, origin: string) => {
  let message;
  if (origin && origin !== '') {
    const resetUrl = `${origin}/authentication/change-password?token=${user.resetToken.token}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${user.resetToken.token}</code></p>`;
  }

  try {
    await sendEmail({
      html: `<h4>Reset Password Email</h4>
               ${message}`,
      subject: 'Sign-up Verification API - Reset Password',
      to: user.email,
    });
  } catch (error) {
    console.error('error sending email', error);
  }
};

export const sendVerificationEmail = async (user: UserInterface, origin: string) => {
  let message;
  if (origin && origin !== '') {
    const verifyUrl = `${origin}/account/verify-email?token=${user.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/account/verify-email</code> api route:</p>
                   <p><code>${user.verificationToken}</code></p>`;
  }

  await sendEmail({
    to: user.email,
    subject: 'Sign-up Verification API - Verify Email',
    html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
  });
};
