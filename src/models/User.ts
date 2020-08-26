import mongoose, { Document, Schema } from 'mongoose';

export interface UserInterface extends Document {
    createdAt: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: string;
    updatedAt: Number;
    resetToken: {
        token: string,
        expires: Date,
    };
    passwordReset: number;
    verified: number;
    acceptTerms: Boolean;
    verificationToken: string,
    isVerified: boolean,
}

const UserSchema: Schema = new Schema({
  createdAt: { type: Date, default: Date.now },
  email: { type: String, unique: true, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  updatedAt: Number,
  resetToken: {
    expires: Date,
    token: String,
  },
  passwordReset: Number,
  verified: Date,
  acceptTerms: Boolean,
  verificationToken: String,
});

UserSchema.virtual('isVerified').get(function (this: { verified: string, passwordReset: Number }) {
  return !!(this.verified || this.passwordReset);
});

UserSchema.set('toJSON', {
  versionKey: false,
  virtuals: true,
  transform(doc, ret) {
    // remove these props when object is serialized
    const retCopy = ret;
    // eslint-disable-next-line no-underscore-dangle
    delete retCopy._id;
    delete retCopy.passwordHash;
  },
});

const Account = mongoose.model<UserInterface>('Account', UserSchema);
export default Account;
