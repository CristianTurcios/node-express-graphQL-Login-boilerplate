import mongoose, { Document, Schema } from 'mongoose';
import { UserInterface } from './User';

export interface RefreshTokenInterface extends Document {
    account: UserInterface;
    created: Date;
    expires: Number;
    replacedByToken: string;
    revoked: number;
    token: string;
    revokedByIp: string;
    createdByIp: string;
    isActive: boolean;
}

const RefreshTokenSchema: Schema = new Schema({
  account: { type: Schema.Types.ObjectId, ref: 'Account' },
  created: { type: Date, default: Date.now },
  createdByIp: String,
  expires: Number,
  replacedByToken: String,
  revoked: Number,
  revokedByIp: String,
  token: String,
});

RefreshTokenSchema.virtual('isExpired').get(function (this: { expires: Number }) {
  return Date.now() >= this.expires;
});

RefreshTokenSchema.virtual('isActive').get(function (this: { revoked: Date, isExpired: boolean }) {
  return !this.revoked && !this.isExpired;
});

const RefreshToken = mongoose.model<RefreshTokenInterface>('RefreshToken', RefreshTokenSchema);
export default RefreshToken;
